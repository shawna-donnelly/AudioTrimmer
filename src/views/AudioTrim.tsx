import { View, Text, StyleSheet } from "react-native";
import React, { FC } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";

interface AudioTrimProps {}
export const AudioTrim: FC<AudioTrimProps> = ({}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, "AudioTrim">>();

    return (
        <View style={styles.container}>
            <Text onPress={() => navigation.navigate("VideoSelect")}>AudioTrim</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 }
});
