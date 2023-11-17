import { ScrollView, Text, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { AudioTrimTimelineFun } from "../components/AudioTrimTimelineFun";
import { PICK_SIZE, Picks } from "../components/Picks";

interface AudioTrimProps {
    route: RouteProp<RootStackParamList, "AudioTrim">;
    navigation: NavigationProp<RootStackParamList, "AudioTrim">;
}
export const AudioTrim: FC<AudioTrimProps> = ({ route, navigation }) => {
    const { samples } = route.params;

    const renderRails = () => (
        <View style={{ flexDirection: "row" }}>
            <Picks data={samples} />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text>{samples.length}</Text>
            <AudioTrimTimelineFun sliderWidth={samples.length * PICK_SIZE} renderRails={renderRails} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 }
});
