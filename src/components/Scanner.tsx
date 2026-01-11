import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

interface ScannerProps {
  isVisible: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
}

export function Scanner({ isVisible, onClose, onScan }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { t } = useApp();

  useEffect(() => {
    if (isVisible) {
      setScanned(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={isVisible} animationType="slide">
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>{t('cameraPermission')}</Text>
          <Button onPress={requestPermission} title={t('grantPermission')} />
          <Button onPress={onClose} title={t('close')} />
        </View>
      </Modal>
    );
  }

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
        />

        <View style={styles.overlay}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="white" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.centerContent}>
            <View style={styles.scanFrame} />
            <Text style={styles.instructions}>
              {t('scanBarcode')}
            </Text>
          </View>

          <View />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    gap: 16,
  },
  permissionText: {
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 32,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 24,
  },
  centerContent: {
    alignItems: 'center',
  },
  scanFrame: {
    width: 260,
    height: 160,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructions: {
    color: '#ffffff',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    maxWidth: '80%',
    flexWrap: 'wrap',
  },
});
