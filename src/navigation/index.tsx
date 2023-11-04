import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VideoSelect } from "../views/VideoSelect";
import { VideoConvert } from "../views/VideoConvert";
import { AudioTrim } from "../views/AudioTrim";

export type RootStackParamList = {
    VideoSelect: undefined;
    AudioTrim: undefined;
    VideoConvert: { uri: string };
};

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="VideoSelect" component={VideoSelect} options={{ headerTitle: "Video Select" }} />
            <Stack.Screen name="AudioTrim" component={AudioTrim} options={{ headerTitle: "Audio Trimmer" }} />
            <Stack.Screen name="VideoConvert" component={VideoConvert} options={{ headerTitle: "Video Convert" }} />
        </Stack.Navigator>
    );
};
