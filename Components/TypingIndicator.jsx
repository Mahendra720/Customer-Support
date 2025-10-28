import { Text, View, Animated } from "react-native";
import { useEffect, useRef } from "react";

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDots = () => {
    const createBounceAnimation = (dot) => {
      return Animated.sequence([
        Animated.timing(dot, {
          toValue: -5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.loop(
      Animated.stagger(150, [
        createBounceAnimation(dot1),
        createBounceAnimation(dot2),
        createBounceAnimation(dot3),
      ])
    ).start();
  };

  useEffect(() => {
    animateDots();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {/* <Text style={styles.text}>Zippybuddy is typing</Text> */}
        <View style={styles.dotsContainer}>
          <Animated.Text
            style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
          >
            ●
          </Animated.Text>
          <Animated.Text
            style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
          >
            ●
          </Animated.Text>
          <Animated.Text
            style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
          >
            ●
          </Animated.Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    marginLeft: 10,
    paddingVertical: 20,
  },
  bubble: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "500",
    marginRight: 6,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
  dot: {
    fontSize: 8,
    color: "#1E40AF",
    marginHorizontal: 2,
  },
};

export default TypingIndicator;
