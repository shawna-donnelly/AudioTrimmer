import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { FC } from "react";

export interface AppButtonProps {
    children?: React.ReactNode;
    onPress?: () => void;
}

export const AppButton: FC<AppButtonProps> = ({ children, onPress }) => {
    return (
        <Pressable style={styles.button} onPress={onPress}>
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
        borderColor: "#2E6EEE"
    }
});
