import { View, Text, StyleSheet } from "react-native";
import React, { FC, useEffect } from "react";
import { colors } from "../utils/color";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress }) => {
    const width = useSharedValue(0);

    useEffect(() => {
        width.value = withTiming(progress);
    }, [progress]);

    const animatedWidth = useAnimatedStyle(() => ({
        width: `${width.value}%`
    }));

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <Animated.View style={[styles.progress, animatedWidth]} />
            </View>
            <Text style={styles.label}>{progress}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    progressContainer: {
        width: 200,
        height: 10,
        borderWidth: 2,
        borderColor: colors.BASE,
        borderRadius: 5,
        overflow: "hidden"
    },
    progress: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.BASE,
        borderRadius: 5
    },
    label: {
        textAlign: "center",
        color: "black",
        paddingVertical: 5
    }
});
