import React, { useEffect, useState } from "react";
import { Grommet, Box, Tabs, Tab } from "grommet";
import Scheduled from "./Scheduled";
import Activity from "./Activity";
import theme from "../theme";
import Themes from "./Themes";

const { stahp } = window;

export default function Settings() {
  const [themeMode, setThemeMode] = useState<"light" | "dark" | undefined>();

  useEffect(() => {
    async function load() {
      const settings = await stahp.getGeneralSettings();
      setThemeMode(settings.theme);
    }

    load();
  }, [stahp]);

  return (
    <Grommet
      full
      theme={theme}
      themeMode={themeMode}
      style={{ background: themeMode ? undefined : "transparent" }}
    >
      <Box
        fill="vertical"
        overflow="auto"
        align="stretch"
        flex="grow"
        direction="column"
        justify="start"
        pad="small"
        round="small"
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
