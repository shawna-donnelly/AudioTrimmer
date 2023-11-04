import React from "react";

import { Navigation } from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";

export const App = () => {
    return (
        <NavigationContainer>
            <Navigation />
        </NavigationContainer>
    );
};
