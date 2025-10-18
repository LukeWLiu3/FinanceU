import { Session, User } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "./supabase";

type Profile = {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  monthly_budget: number;
  user_id: string;
};

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  hasCompletedProfile: boolean;
  profile: Profile | null;
  logIn: (user: User, session: Session) => void;
  logOut: () => void;
  checkSession: () => Promise<void>;
  checkProfileCompletion: () => Promise<void>;
  setProfileCompleted: (completed: boolean) => void;
  saveProfile: (profileData: Partial<Profile>) => Promise<boolean>;

  fetchProfile: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
};

// Custom storage that only stores essential data
const customStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    return value;
  },
  setItem: async (name: string, value: string) => {
    const data = JSON.parse(value);
    // Only store essential data to avoid SecureStore size limit
    const essentialData = {
      state: {
        isLoggedIn: data.state.isLoggedIn,
        hasCompletedProfile: data.state.hasCompletedProfile,
        user: data.state.user
          ? {
              id: data.state.user.id,
              email: data.state.user.email,
            }
          : null,
      },
    };
    await SecureStore.setItemAsync(name, JSON.stringify(essentialData));
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      session: null,
      isLoggedIn: false,
      hasCompletedProfile: false,
      profile: null,
      logIn: (user, session) => {
        set({ user, session, isLoggedIn: true });
        // Set the session in Supabase client
        supabase.auth.setSession(session);
        get().checkProfileCompletion();
      },
      logOut: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          session: null,
          isLoggedIn: false,
          hasCompletedProfile: false,
          profile: null,
        });
      },
      checkSession: async () => {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("Session check error:", error);
            set({ user: null, session: null, isLoggedIn: false });
            return;
          }

          if (session && session.user) {
            // Session is valid, update store
            set({
              user: session.user,
              session: session,
              isLoggedIn: true,
            });
            // Check profile completion after successful session validation
            get().checkProfileCompletion();
          } else {
            // No valid session
            set({
              user: null,
              session: null,
              isLoggedIn: false,
              hasCompletedProfile: false,
              profile: null,
            });
          }
        } catch (error) {
          console.error("Session validation error:", error);
          set({
            user: null,
            session: null,
            isLoggedIn: false,
            hasCompletedProfile: false,
            profile: null,
          });
        }
      },
      checkProfileCompletion: async () => {
        const { user } = get();
        if (!user?.id) return;

        try {
          const { data, error } = await supabase
            .from("Profiles")
            .select("full_name, monthly_budget")
            .eq("user_id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            // PGRST116 is "not found" error
            console.error("Profile check error:", error);
            set({ hasCompletedProfile: false });
            return;
          }

          // Profile is complete if user has both full_name and monthly_budget
          const isComplete =
            data && data.full_name && data.monthly_budget !== null;
          set({ hasCompletedProfile: !!isComplete });
        } catch (error) {
          console.error("Profile completion check error:", error);
          set({ hasCompletedProfile: false });
        }
      },
      setProfileCompleted: (completed: boolean) => {
        set({ hasCompletedProfile: completed });
      },
      saveProfile: async (profileData: Partial<Profile>) => {
        const { user } = get();
        if (!user?.id) return false;

        try {
          const { error } = await supabase.from("Profiles").upsert({
            user_id: user.id,
            full_name: profileData.full_name,
            email: profileData.email || user.email,
            monthly_budget: profileData.monthly_budget,
          });

          if (error) {
            console.error("Profile save error:", error);
            return false;
          }

          // Update local state
          set({
            profile: {
              user_id: user.id,
              full_name: profileData.full_name || "",
              email: profileData.email || user.email || "",
              monthly_budget: profileData.monthly_budget || 0,
            },
            hasCompletedProfile: true,
          });

          return true;
        } catch (error) {
          console.error("Profile save error:", error);
          return false;
        }
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user?.id) return;

        try {
          const { data, error } = await supabase
            .from("Profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Profile fetch error:", error);
            return;
          }

          if (data) {
            set({
              profile: {
                id: data.id,
                created_at: data.created_at,
                user_id: data.user_id,
                full_name: data.full_name || "",
                email: data.email || "",
                monthly_budget: data.monthly_budget || 0,
              },
            });
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
        }
      },

      deleteAccount: async () => {
        const { user } = get();
        if (!user?.id) return false;

        try {
          // First delete the user's profile data
          const { error: profileError } = await supabase
            .from("Profiles")
            .delete()
            .eq("user_id", user.id);

          if (profileError) {
            console.error("Profile deletion error:", profileError);
            return false;
          }

          // Delete any budget/expenses data if exists
          const { error: budgetError } = await supabase
            .from("budget")
            .delete()
            .eq("user_id", user.id);

          // Don't fail if budget table doesn't exist or has no data
          if (
            budgetError &&
            budgetError.code !== "42P01" &&
            budgetError.code !== "PGRST116"
          ) {
            console.error("Budget deletion error:", budgetError);
          }

          // Clear local state first to trigger navigation change
          set({
            user: null,
            session: null,
            isLoggedIn: false,
            hasCompletedProfile: false,
            profile: null,
          });

          // Add a small delay to ensure state changes propagate
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Then sign out the user from Supabase
          // We do this after clearing state to avoid navigation conflicts
          await supabase.auth.signOut();

          // Note: For complete account deletion from Supabase Auth,
          // you may need to implement a server-side function or use Supabase's
          // admin API from your backend. For now, we've deleted all user data
          // and signed them out.

          return true;
        } catch (error) {
          console.error("Account deletion error:", error);
          // Still clear state even if signOut fails
          set({
            user: null,
            session: null,
            isLoggedIn: false,
            hasCompletedProfile: false,
            profile: null,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => customStorage),
    },
  ),
);
