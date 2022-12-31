import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Footer({ onStop, onPause, onSkip, hasPaused, isSound, toggleSound }) {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.pauseBtnContainer}>
        <Pressable
          style={styles.btn}
          android_ripple={{ color: "#c9b5b5", foreground: true }}
          onPress={toggleSound}
        >
          {isSound ? (
            <Ionicons name="volume-high" size={36} color="#EEEEEE" />
          ) : (
            <Ionicons name="volume-mute" size={36} color="#EEEEEE" />
          )}
        </Pressable>

        <Pressable
          style={styles.btn}
          android_ripple={{ color: "#c9b5b5", foreground: true }}
          onPress={onStop}
        >
          <Ionicons name="stop" size={36} color="#eb6565" />
        </Pressable>

        <Pressable
          style={styles.btn}
          android_ripple={{ color: "#c9b5b5", foreground: true }}
          onPress={onPause}
        >
          {!hasPaused ? (
            <Ionicons name="pause" size={36} color="#00ADB5" />
          ) : (
            <Ionicons name="play" size={36} color="#00ADB5" />
          )}
        </Pressable>

        <Pressable
          style={styles.btn}
          android_ripple={{ color: "#c9b5b5", foreground: true }}
          onPress={onSkip}
        >
          <Ionicons name="play-skip-forward" size={36} color="#EEEEEE" />
        </Pressable>
      </View>
    </View>
  );
}
export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 12,
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
  btn: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    borderRadius: 50,
    overflow: "hidden",
  },
});
