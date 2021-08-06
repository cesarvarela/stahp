import React, { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Button,
  Heading,
} from "grommet";
import { IGeneralSettings } from "../interfaces";

const {
  getGeneralSettings,
  openDevTools,
  getVersion,

} = window.stahp;


export default function General() {

  const [version, setVersion] = useState(null);
  const [settings, setSettings] = useState<IGeneralSettings>(null);

  useEffect(() => {
    const fetch = async () => {
      const settings = await getGeneralSettings()
      const version = await getVersion()

      setSettings(settings);
      setVersion(version);
    };

    fetch();
  }, [getGeneralSettings]);


  return (
    <Box
      align="stretch"
      justify="center"
      direction="column"
      pad={{ top: "small" }}
    >
      <Box direction="row" justify="between" align="center">
        <Heading level="2" size="small">
          General
        </Heading>
      </Box>
      {settings == null ? (
        <Box align="center" justify="center" pad="large">
          <Spinner size="medium" />
        </Box>
      ) : (
        <Box
          background={{ color: "background-front" }}
          pad="medium"
          round="small"
        >
          {version}
        </Box>
      )}
      <Box
        align="center"
        justify="start"
        direction="row"
        margin={{ top: "medium" }}
        gap="small"
      >
        <Button
          label="Open dev tools"
          secondary
          onClick={() => openDevTools()}
        />
      </Box>
    </Box>
  );
}
