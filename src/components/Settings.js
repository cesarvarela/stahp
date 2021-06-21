import React from 'react'
import { Grommet, Box, Header, Text } from 'grommet'
import Scheduled from './Scheduled'
import theme from '../theme'

export default function Settings() {

    return <Grommet full theme={theme}>
        <Box fill="vertical" overflow="auto" align="stretch" flex="grow" justify="start" direction="column">
            <Header align="center" direction="row" justify="start" gap="medium" fill="horizontal" pad="medium">
                <Text>
                    Stahp
                </Text>
            </Header>
            <Scheduled />
        </Box>
    </Grommet>
}