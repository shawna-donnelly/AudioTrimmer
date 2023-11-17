import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import { AppButton } from "./AppButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../utils/color";

interface AudioEditOptionsProps {
    convertAnother?: boolean;
    disableTrimButton?: boolean;
    convertAnotherPress: () => void;
    onSavePress: () => void;
    onTrimPress: () => void;
}
export const AudioEditOptions: FC<AudioEditOptionsProps> = ({
    convertAnother,
    disableTrimButton,
    convertAnotherPress,
    onSavePress,
    onTrimPress
}) => {
    return (
        <View style={styles.container}>
            {convertAnother ? (
                <AppButton style={styles.button} onPress={convertAnotherPress}>
                    <MaterialIcon name="multitrack-audio" size={25} color={colors.BASE} />
                    <Text style={styles.btnTitle}>Convert Audio</Text>
                </AppButton>
            ) : (
                <AppButton style={styles.button} onPress={onSavePress}>
                    <AntDesign name="save" size={25} color={colors.BASE} />
                    <Text style={styles.btnTitle}>Save File</Text>
                </AppButton>
            )}

            <AppButton
                style={[styles.button, { opacity: disableTrimButton ? 0.5 : 1 }]}
                onPress={disableTrimButton ? undefined : onTrimPress}
            >
                <MaterialCommunityIcons name="scissors-cutting" size={25} color={colors.BASE} />
                <Text style={styles.btnTitle}>Trim Audio</Text>
            </AppButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        margin: 2,
        flexShrink: 1,
        flexDirection: "row"
    },
    btnTitle: { marginLeft: 2, color: colors.BASE, fontWeight: "600" },
    button: {
        marginHorizontal: 2
    }
});
