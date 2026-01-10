import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';

interface ScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export function Scanner({ isVisible, onClose, onScan }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setScanned(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <View className="flex-1 justify-center items-center bg-slate-900">
          <Text className="text-white mb-4">We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
          <Button onPress={onClose} title="close" />
        </View>
      </Modal>
    );
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    // ISBN usually starts with 978 or 979
    onScan(data);
    // Don't close immediately, let parent handle it or close manually?
    // Usually close immediately or vibrate.
    // Parent handles logic.
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1 bg-black">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
        />

        {/* Overlay */}
        <View className="flex-1 justify-between p-6 pb-12">
           <View className="flex-row justify-end mt-8">
              <TouchableOpacity onPress={onClose} className="bg-black/50 p-2 rounded-full">
                  <X color="white" size={24} />
              </TouchableOpacity>
           </View>

           <View className="items-center">
              <View className="w-64 h-40 border-2 border-white/50 rounded-lg bg-transparent" />
              <Text className="text-white mt-4 text-center bg-black/50 p-2 rounded">
                 Scan ISBN barcode on the back of the book
              </Text>
           </View>

           <View />
        </View>
      </View>
    </Modal>
  );
}
