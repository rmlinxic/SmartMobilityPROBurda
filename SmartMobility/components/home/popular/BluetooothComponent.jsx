import { BleManager } from "react-native-ble-plx";
import { PermissionsAndroid, ToastAndroid, Platform } from "react-native";

export const manager = new BleManager();

requestBluetoothPermission = async () => {
  if (Platform.OS === "ios") {
    return true;
  } else if (
    Platform.OS === "android" &&
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  ) {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN &&
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      if (
        result["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      } else {
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Permissão não concedida para Bluetooth.",
            ToastAndroid.SHORT
          );
        }
      }
    }
  }
  return false;
};

React.useEffect(() => {
  const handleStateChange = (state) => {
    if (state === "PoweredOn") {
      scanAndConnect();
      manager.offStateChange(handleStateChange);
    }
  };
  const subscription = manager.onStateChange(handleStateChange, true);
  return () => {
    manager.offStateChange(handleStateChange);
  };
}, [manager]);

export function scanAndConnect() {
  return new Promise((resolve, reject) => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(
          "Erro durante a varredura de dispositivos Bluetooth:",
          error
        );
        reject(error); // Rejeita a promessa em caso de erro
        return;
      }
      if (
        device &&
        (device.name === "TI BLE Sensor Tag" || device.name === "SensorTag")
      ) {
        manager.stopDeviceScan(); // Interrompe a varredura, pois não é necessária se um dispositivo foi encontrado
        connectToDevice(device); // Lógica para conectar ao dispositivo encontrado
        resolve(true); // Resolve a promessa se o dispositivo for encontrado
      }
    });
  });
}

function connectToDevice(device) {
  console.log("Conectando ao dispositivo:", device.name); // Lógica para conectar ao dispositivo Bluetooth
}
