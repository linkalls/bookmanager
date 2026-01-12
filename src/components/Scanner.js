"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = Scanner;
var react_1 = require("react");
var react_native_1 = require("react-native");
var expo_camera_1 = require("expo-camera");
var lucide_react_native_1 = require("lucide-react-native");
var AppContext_1 = require("../context/AppContext");
function Scanner(_a) {
    var isVisible = _a.isVisible, onClose = _a.onClose, onScan = _a.onScan;
    var _b = (0, expo_camera_1.useCameraPermissions)(), permission = _b[0], requestPermission = _b[1];
    var _c = (0, react_1.useState)(false), scanned = _c[0], setScanned = _c[1];
    var t = (0, AppContext_1.useApp)().t;
    (0, react_1.useEffect)(function () {
        if (isVisible) {
            setScanned(false);
        }
    }, [isVisible]);
    if (!isVisible)
        return null;
    if (!permission) {
        return <react_native_1.View />;
    }
    if (!permission.granted) {
        return (<react_native_1.Modal visible={isVisible} animationType="slide">
        <react_native_1.View style={styles.permissionContainer}>
          <react_native_1.Text style={styles.permissionText}>{t('cameraPermission')}</react_native_1.Text>
          <react_native_1.Button onPress={requestPermission} title={t('grantPermission')}/>
          <react_native_1.Button onPress={onClose} title={t('close')}/>
        </react_native_1.View>
      </react_native_1.Modal>);
    }
    var handleBarcodeScanned = function (_a) {
        var type = _a.type, data = _a.data;
        if (scanned)
            return;
        setScanned(true);
        onScan(data);
    };
    return (<react_native_1.Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen">
      <react_native_1.View style={styles.container}>
        <expo_camera_1.CameraView style={react_native_1.StyleSheet.absoluteFillObject} facing="back" onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
        }}/>

        <react_native_1.View style={styles.overlay}>
          <react_native_1.View style={styles.topRow}>
            <react_native_1.TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <lucide_react_native_1.X color="white" size={24}/>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          <react_native_1.View style={styles.centerContent}>
            <react_native_1.View style={styles.scanFrame}/>
            <react_native_1.Text style={styles.instructions}>
              {t('scanBarcode')}
            </react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View />
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.Modal>);
}
var styles = react_native_1.StyleSheet.create({
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
