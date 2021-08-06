import * as Sentry from '@sentry/react';
import React from "react";
import Settings from "./Settings";
import { Box, Text, Anchor, Grommet } from "grommet";
import { hpe } from "grommet-theme-hpe";

function FallbackComponent() {
    return (
        <Grommet full themeMode="dark" theme={hpe} >
            <Box align="center" justify="center" direction="column" fill="vertical" gap="small">
                <Text>
                    An error has ocurred plese report any issues here:
                </Text>
                <Anchor label="https://github.com/cesarvarela/stahp/issues" href="https://github.com/cesarvarela/stahp/issues" target="_blank" />
            </Box>
        </Grommet >
    )
}

export default function App() {
    return <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
        <Settings />
    </Sentry.ErrorBoundary>
}