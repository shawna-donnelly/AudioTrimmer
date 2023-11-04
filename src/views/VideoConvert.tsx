import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { AppButton } from "../components/AppButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "../utils/color";

interface VideoConvertProps {}
export const VideoConvert: FC<VideoConvertProps> = ({}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, "VideoConvert">>();

    return (
        <View style={styles.container}>
            <AppButton>
                <Icon name="multitrack-audio" size={25} color={colors.BASE} />
                <Text style={styles.btnTitle} onPress={() => console.log("convert")}>
                    Convert File
                </Text>
            </AppButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    btnTitle: {
        marginLeft: 5,
        color: colors.BASE,
        fontWeight: "600",
        fontSize: 20
    }
});
