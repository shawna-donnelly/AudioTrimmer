import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppButton } from "../components/AppButton";
import Icon from "react-native-vector-icons/Ionicons";
import { openPicker } from "react-native-image-crop-picker";
import { getPermission } from "../utils/permission";
import { RootStackParamList } from "../navigation";

interface VideoSelectProps {}
export const VideoSelect: FC<VideoSelectProps> = ({}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, "VideoSelect">>();

    const onVideoSelect = async () => {
        try {
            await getPermission();
            const { sourceURL, path } = await openPicker({ mediaType: "video" });
            const uri = sourceURL || path;
            navigation.navigate("VideoConvert", { uri });

            console.log({ sourceURL, path });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <AppButton onPress={onVideoSelect}>
                <Icon style={styles.icon} name="cloud-upload-outline" size={25} color={"#2E6EEE"} />
                <Text style={styles.buttonTitle}>Select a Video File</Text>
            </AppButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    buttonTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2E6EEE"
    },
    icon: {
        padding: 5
    }
});
