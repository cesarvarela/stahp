import React from "react";
import { Grommet, Box, Header, Text, Tabs, Tab } from "grommet";
import Scheduled from "./Scheduled";
import Activity from "./Activity";
import theme from "../theme";
import { Clock, Schedules } from "grommet-icons";

export default function Settings() {
  return (
    <Grommet full theme={theme}>
      <Box
        fill="vertical"
        overflow="auto"
        align="stretch"
        flex="grow"
        justify="start"
        direction="column"
      >
        <Header
          align="center"
          direction="row"
          justify="start"
          gap="medium"
          fill="horizontal"
          pad="medium"
        >
          <Text>Stahp</Text>
        </Header>

        <Tabs flex>
          <Tab title="Activity" icon={<Clock />}>
            <Activity />
          </Tab>
          <Tab title="Schedules" icon={<Schedules />}>
            <Scheduled />
          </Tab>
        </Tabs>
      </Box>
    </Grommet>
  );
}
