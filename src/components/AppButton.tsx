import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React, { FC } from "react";
import { colors } from "../utils/color";

export interface AppButtonProps {
    children?: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
}

export const AppButton: FC<AppButtonProps> = ({ children, onPress, style = {} }) => {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress}>
            {children}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 4,
        padding: 10,
        borderRadius: 5,
        borderColor: colors.BASE
    }
});
