import React from "react";
import { Grommet, Box, Tabs, Tab } from "grommet";
import Scheduled from "./Scheduled";
import Activity from "./Activity";
import theme from "../theme";
import Themes from "./Themes";

export default function Settings() {
  return (
    <Grommet full theme={theme}>
      <Box
        fill="vertical"
        overflow="auto"
        align="stretch"
        flex="grow"
        direction="column"
        justify="start"
        pad="small"
        round="small"
        background={{ color: "background-back" }}
      >
        <Tabs justify="start">
          <Tab title="Activity">
            <Activity />
          </Tab>
          <Tab title="Schedule">
            <Scheduled />
          </Tab>
          <Tab title="Themes">
            <Themes />
          </Tab>
        </Tabs>
      </Box>
    </Grommet>
  );
}
