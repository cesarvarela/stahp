import React, { useEffect, useState } from "react";
import { Grommet, Box, Tabs, Tab } from "grommet";
import Scheduled from "./Scheduled";
import Activity from "./Activity";
import theme from "../theme";
import Themes from "./Themes";

const { stahp } = window;

export default function Settings() {
  const [themeMode, setThemeMode] = useState<"light" | "dark" | undefined>();

  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    parseInt(localStorage.getItem("activeTabIndex")) || 0
  );

  useEffect(() => {
    async function load() {
      const settings = await stahp.getGeneralSettings();
      setThemeMode(settings.theme);
    }

    load();
  }, [stahp]);

  useEffect(() => {
    localStorage.setItem("activeTabIndex", activeTabIndex.toString());
  }, [activeTabIndex]);

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
        <Tabs
          justify="start"
          activeIndex={activeTabIndex}
          onActive={(index) => setActiveTabIndex(index)}
        >
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
