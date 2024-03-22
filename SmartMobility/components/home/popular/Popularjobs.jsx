import { useRouter } from "expo-router";
import { View, Text, Alert } from "react-native";

import styles from "./popularjobs.style";
import GoogleMapsAPI from "../welcome/GoogleMapsAPI";
import VamosComecar from "./VamosComecar";
import { scanAndConnect } from "./BluetooothComponent";

function showPopup() {
  Alert.alert(
    "No Bluetooth device conected",
    "Make sure to connect to your B1K3L4B device",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ],
    { cancelable: false }
  );
}
const Popularjobs = () => {
  const router = useRouter();

  // Condition for showing the popup
  const isSetupConcluded = scanAndConnect(); // trocar pela conferencia de bluetooth quando ejetar

  if (!isSetupConcluded) {
    showPopup();
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Vamos Nessa!</Text>
      </View>
      <View>
        <View>
          <Text style={styles.headertitle}>Dispositivos Conectados:</Text>
        </View>
        <View>
          <Text>{device.name};</Text>
        </View>
      </View>
      <GoogleMapsAPI />
      <View>
        <VamosComecar />
      </View>
    </View>
  );
};

export default Popularjobs;
