import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { FC } from "react";
import Icon from "react-native-vector-icons/Entypo";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";

import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

interface AudioTrimTimelineFunProps {
    sliderWidth: number;
    renderRails(): JSX.Element;
}

interface ThumbProps {
    iconName: string;
    side: "left" | "right";
}
const Thumb: FC<ThumbProps> = ({ iconName, side }) => {
    return (
        <View
            style={{
                backgroundColor: `rgba(0,0,0,0.7)`,
                height: "100%",
                justifyContent: "center",
                borderTopLeftRadius: side === "left" ? 10 : undefined,
                borderBottomLeftRadius: side === "left" ? 10 : undefined,
                borderTopRightRadius: side === "right" ? 10 : undefined,
                borderBottomRightRadius: side === "right" ? 10 : undefined,
                transform: [{ translateX: side === "left" ? -THUMB_SIZE : 0 }]
            }}
        >
            <Icon size={24} color="white" name={iconName}></Icon>
        </View>
    );
};

const THUMB_SIZE = 40;

export const AUDIO_TRIM_SLIDER_HEIGHT = 40;
export const AUDIO_TRIM_SLIDER_PICK_HEIGHT = 30;

export const AudioTrimTimelineFun: FC<AudioTrimTimelineFunProps> = ({ sliderWidth, renderRails }) => {
    const minimumPos = useSharedValue(0);
    const maximumPos = useSharedValue(sliderWidth - THUMB_SIZE);

    const animatedStyleMin = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: minimumPos.value }]
        };
    });

    const animatedStyleMax = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: maximumPos.value }]
        };
    });

    const gestureHandleMinimum = useAnimatedGestureHandler({
        onActive: (event, ctx) => {
            const minClamp = 0;
            const maxClamp = maximumPos.value - 50;

            let newVal = Math.max(minClamp, event.absoluteX);
            minimumPos.value = newVal > maxClamp ? maxClamp : newVal;
        },
        onStart: (event, ctx) => {
            ctx.startX = minimumPos.value;
        }
    });
    const gestureHandleMaximum = useAnimatedGestureHandler({
        onStart: (event, ctx) => {
            ctx.startX = maximumPos.value;
        },
        onActive: (event, ctx) => {
            maximumPos.value = Math.min(ctx.startX + event.translationX, sliderWidth);
        }
    });

    return (
        <GestureHandlerRootView>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={[styles.container]}>
                <View style={[styles.inactiveRailSlider, { width: sliderWidth, borderWidth: 1 }]}>{renderRails()}</View>
                <View style={styles.activeRailSlider}>{renderRails()}</View>

                {/* Thumb Left */}
                <PanGestureHandler onGestureEvent={gestureHandleMinimum}>
                    <Animated.View style={[styles.thumb, animatedStyleMin, { left: 0 }]}>
                        <Thumb side="left" iconName="chevron-left" />
                    </Animated.View>
                </PanGestureHandler>
                {/* Thumb Right */}
                <PanGestureHandler onGestureEvent={gestureHandleMaximum}>
                    <Animated.View style={[styles.thumb, animatedStyleMax, { left: sliderWidth }]}>
                        <Thumb side="right" iconName="chevron-right" />
                    </Animated.View>
                </PanGestureHandler>
            </ScrollView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    inactiveRailSlider: {
        flexDirection: "row",
        height: AUDIO_TRIM_SLIDER_HEIGHT,
        backgroundColor: "#DFEAFB",
        opacity: 0.3,
        alignItems: "center"
    },
    activeRailSlider: {
        flexDirection: "row",
        height: AUDIO_TRIM_SLIDER_HEIGHT,
        backgroundColor: `rgba(0, 0, 200, 0.2)`,
        alignItems: "center",
        position: "absolute",
        width: "50%",
        overflow: "hidden"
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        backgroundColor: "transparent",
        position: "absolute"
    }
});
