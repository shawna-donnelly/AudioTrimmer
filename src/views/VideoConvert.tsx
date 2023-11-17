import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation";
import { AppButton } from "../components/AppButton";
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from "../utils/color";
import RNFS from "react-native-fs";
import { FFmpegKit, FFmpegSession, FFprobeKit, Log, ReturnCode, Statistics } from "ffmpeg-kit-react-native";
import { ProgressBar } from "../components/ProgressBar";
import { AudioEditOptions } from "../components/AudioEditOptions";
import { AUDIO_TRIM_SLIDER_PICK_HEIGHT } from "../components/AudioTrimTimelineFun";

const AUDIO_SAMPLE_SIZE = 15;

const extractAudioSampleAndSave = async (filePath: string) => {
    try {
        console.log("INside extractAudioSampleAndSave");
        const appDir = Platform.OS === "android" ? RNFS.CachesDirectoryPath : RNFS.CachesDirectoryPath;

        const fileName = `${Date.now()}_log.txt`;
        const outputPath = `${appDir}/${fileName}`;
        const samples = 44100 / AUDIO_SAMPLE_SIZE;
        const command = `-i ${filePath} -af asetnsamples=${samples},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=${outputPath} -f null -`;

        await FFmpegKit.executeAsync(
            command,
            async (session: FFmpegSession) => {
                const returnCode = await session.getReturnCode();
                if (ReturnCode.isSuccess(returnCode)) {
                    console.log("Successfully extracted audio sample");
                } else if (ReturnCode.isCancel(returnCode)) {
                    console.log("Command cancelled");
                } else {
                    console.log("Failed to extract audio sample");
                }
            },
            (log: Log) => {
                console.log(log.getMessage());
            },
            (statistics: Statistics) => {
                console.log(statistics.getVideoFrameNumber());
            }
        );
        return outputPath;
    } catch (err) {
        console.log("Error while extracting audio sample: ", err);
    }
};

type FileInfo = {
    path: string;
    name: string;
    samplePath?: string;
};
interface VideoConvertProps {
    route: RouteProp<RootStackParamList, "VideoConvert">;
    navigation: NavigationProp<RootStackParamList, "VideoConvert">;
}
export const VideoConvert: FC<VideoConvertProps> = ({ route, navigation }) => {
    const uri = route.params.uri;

    const [progress, setProgress] = useState<number>(0);
    const [fileInfo, setFileInfo] = useState<FileInfo>({
        path: "",
        name: ""
    });
    const [fileSaved, setFileSaved] = useState<boolean>(false);
    const [samples, setSamples] = useState<number[]>([]);

    useEffect(() => {
        console.log({ progress });
    }, [progress]);

    const extractNameFromUri = (uri: string) => {
        const splittedUri = uri.split("/");
        const fullName = splittedUri[splittedUri.length - 1];
        const fileName = fullName.split(".")[0];
        // replace non-alphanumeric characters with underscore
        let sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, "_");
        const fileExtension = fullName.split(".")[1];

        sanitizedFileName = sanitizedFileName.replace(/\s+/g, "_");

        return { sanitizedFileName, fileExtension };
    };

    const convertToAudio = async () => {
        // input url => copy the uri inside our cache dir
        try {
            const { sanitizedFileName, fileExtension } = extractNameFromUri(uri);
            const uniqueFileName = `${sanitizedFileName}_${Date.now()}.${fileExtension}`;

            const cacheDir = RNFS.CachesDirectoryPath;
            const uniqueFilePath = `${cacheDir}/${uniqueFileName}`;

            await RNFS.copyFile(uri, uniqueFilePath);
            const mediaInfo = await FFprobeKit.getMediaInformation(uniqueFilePath);
            const output = await mediaInfo.getOutput();
            const duration = JSON.parse(output).format.duration * 1000;
            const uniqueOutputName = `${sanitizedFileName}_${Date.now()}.mp3`;
            const outputBasePath = RNFS.CachesDirectoryPath;

            const outputPath = `${outputBasePath}/${uniqueOutputName}`;

            const command = `-i ${uniqueFilePath} -vn -acodec libmp3lame -qscale:a 2 ${outputPath}`;

            await FFmpegKit.executeAsync(
                command,
                async (session: FFmpegSession) => {
                    const returnCode = await session.getReturnCode();
                    if (ReturnCode.isSuccess(returnCode)) {
                        const samplePath = await extractAudioSampleAndSave(outputPath);
                        setFileInfo({
                            name: uniqueOutputName,
                            path: outputPath,
                            samplePath: samplePath
                        });
                    } else if (ReturnCode.isCancel(returnCode)) {
                        console.log("Command cancelled");
                        setFileInfo({ name: "", path: "" });
                    } else {
                        Alert.alert("Error", "Failed to convert video to audio");
                    }
                },
                (log: Log) => {
                    console.log(log.getMessage());
                },
                (statistics: Statistics) => {
                    const time = statistics.getTime();
                    setProgress(Math.ceil((100 * time) / duration));
                }
            );
        } catch (err) {
            console.log("ERror while converting: ", err);
        }

        // output url => unique name with the output path
    };

    const downloadAudio = async () => {
        try {
            const appDirectory = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.LibraryDirectoryPath;

            const saveDirectory = `${appDirectory}/Audio Trimmer`;

            const exists = await RNFS.exists(saveDirectory);
            if (!exists) {
                await RNFS.mkdir(saveDirectory);
            }
            console.log({ fileInfo });
            await RNFS.copyFile(fileInfo.path, `${saveDirectory}/${fileInfo.name}`);
            Alert.alert("saved your file!");

            console.log("Saved to ", saveDirectory);
            setFileSaved(true);
        } catch (err) {
            console.log("error while downloading: ", err);
        }
    };

    const handleConvertAnotherPress = () => {
        setFileInfo({ name: "", path: "" });
        setFileSaved(false);
        setProgress(0);
        navigation.goBack();
    };

    const filterAudioSamplesFromFile = async (filePath: string) => {
        try {
            const data = await RNFS.readFile(filePath, "utf8");
            const lines = data.split("\n");
            const levels: number[] = [];
            let minRMS = 0;
            let maxRMS = -160;
            lines.forEach((line: string) => {
                if (line.includes("RMS_level")) {
                    const level = line.split("=")[1];
                    let rms = parseFloat(level);
                    if (rms < minRMS) {
                        minRMS = rms;
                    }
                    if (rms > maxRMS) {
                        maxRMS = rms;
                    }
                    levels.push(rms);
                }
            });
            console.log({ minRMS, maxRMS });
            const minHeight = 0;
            const maxHeight = AUDIO_TRIM_SLIDER_PICK_HEIGHT;

            const samples = levels.map(rmsLevel => {
                const level = isNaN(rmsLevel) ? minRMS : rmsLevel;
                return mapRMSLevelsToHeight({
                    maximumHeight: maxHeight,
                    minimumHeight: minHeight,
                    maximumRMS: maxRMS,
                    minRMS: minRMS,
                    rmsLevel: level
                });
            });
            console.log({ samples });
            setSamples(samples);
            return samples;
        } catch (error) {
            console.log("Something happened while filtering audio samples: ", error);
            return [];
        }
    };

    const handleTrimPress = async () => {
        if (!fileInfo.samplePath) {
            return;
        }
        let samplesArray = await filterAudioSamplesFromFile(fileInfo.samplePath);
        navigation.navigate("AudioTrim", { samples: samplesArray });
    };

    type MapRMSOptions = {
        rmsLevel: number;
        minRMS: number;
        maximumRMS: number;
        minimumHeight: number;
        maximumHeight: number;
    };

    const mapRMSLevelsToHeight = (options: MapRMSOptions) => {
        const { rmsLevel, minRMS, maximumRMS, minimumHeight, maximumHeight } = options;

        const height = minimumHeight + ((rmsLevel - minRMS) * (maximumHeight - minimumHeight)) / (maximumRMS - minRMS);
        return height;
    };

    return (
        <View style={styles.container}>
            {!progress ? (
                <AppButton>
                    <Icon name="multitrack-audio" size={25} color={colors.BASE} />
                    <Text style={styles.btnTitle} onPress={convertToAudio}>
                        Convert File
                    </Text>
                </AppButton>
            ) : null}

            <View style={{ flexShrink: 1, marginTop: 10, alignItems: "center", justifyContent: "center" }}>
                {progress >= 100 ? (
                    <AudioEditOptions
                        convertAnotherPress={handleConvertAnotherPress}
                        disableTrimButton={!fileInfo.samplePath}
                        onSavePress={async () => {
                            await downloadAudio();
                        }}
                        onTrimPress={handleTrimPress}
                        convertAnother={fileSaved}
                    />
                ) : (
                    <ProgressBar progress={progress} />
                )}
            </View>
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
