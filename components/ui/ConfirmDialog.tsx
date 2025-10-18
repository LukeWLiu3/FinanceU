import React from "react";
import { Modal, View, Text, Pressable, ActivityIndicator } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  destructive = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 mx-6 w-full max-w-sm">
          <Text className="text-xl font-bold text-gray-900 mb-2">{title}</Text>

          <Text className="text-gray-600 text-base leading-6 mb-6">
            {message}
          </Text>

          <View className="flex-row space-x-3">
            <Pressable
              className="flex-1 bg-gray-100 py-3 rounded-lg active:bg-gray-200"
              onPress={onCancel}
              disabled={loading}
            >
              <Text className="text-gray-700 text-center font-semibold">
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 py-3 rounded-lg ${
                destructive
                  ? loading
                    ? "bg-red-400"
                    : "bg-red-600 active:bg-red-700"
                  : loading
                    ? "bg-emerald-400"
                    : "bg-emerald-600 active:bg-emerald-700"
              }`}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  {confirmText}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDialog;
