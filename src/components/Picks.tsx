import { View } from "react-native";
import React, { FC } from "react";
import { AUDIO_TRIM_SLIDER_PICK_HEIGHT } from "./AudioTrimTimelineFun";

export interface PicksProps {
    data: number[];
}

export const PICK_WIDTH = 1.5;
export const PICK_GAP = 1;
export const PICK_SIZE = PICK_WIDTH + PICK_GAP;

export const Picks: FC<PicksProps> = ({ data }) => {
    return (
        <>
            {data.map((height, index) => (
                <View
                    style={{
                        height: height + 1,
                        width: PICK_WIDTH,
                        borderRadius: 3,
                        marginRight: index === data.length - 1 ? 0 : PICK_GAP,
                        backgroundColor: `rgb(0,0,200)`,
                        transform: [{ translateY: AUDIO_TRIM_SLIDER_PICK_HEIGHT / 2 }],
                        top: -height / 2
                    }}
                    key={`sample_${index}`}
                />
            ))}
        </>
    );
};
