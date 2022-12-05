import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Footer({ onStop, onPause, onSkip, hasPaused }) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.pauseBtnContainer}>
        <View>
          <Pressable
            android_ripple={{ color: "#c9b5b5", radius: 20 }}
            onPress={onStop}
          >
            <Ionicons name="stop" size={40} color="#EEEEEE" />
          </Pressable>
        </View>
        <View>
          <Pressable
            android_ripple={{ color: "#c9b5b5", radius: 20 }}
            onPress={onPause}
          >
            {!hasPaused ? (
              <Ionicons name="pause" size={40} color="#EEEEEE" />
            ) : (
              <Ionicons name="play" size={40} color="#EEEEEE" />
            )}
          </Pressable>
        </View>
        <View>
          <Pressable
            android_ripple={{ color: "#c9b5b5", radius: 20 }}
            onPress={onSkip}
          >
            <Ionicons name="play-skip-forward" size={40} color="#EEEEEE" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 16,
    backgroundColor: "#393E46",
    padding: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  pauseBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
