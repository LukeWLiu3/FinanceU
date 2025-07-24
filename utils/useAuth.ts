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
            .from("profile")
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
          const { error } = await supabase.from("profile").upsert({
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
            .from("profile")
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
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => customStorage),
    },
  ),
);