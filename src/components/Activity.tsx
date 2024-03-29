import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  Select,
  CheckBox,
  Spinner,
  Form,
  Button,
  Heading,
  Card,
  CardBody,
} from "grommet";
import { IActivitySettings, IThemePackage } from "../interfaces";
import styled from "styled-components";
import { formatDuration } from "date-fns";

const SelectSmall = styled(Select)`
  width: 120px;
`;

const {
  takeLongBreak,
  getActivitySettings,
  setActivitySettings,
  getActiveTargetTime,
  getActiveTime,
  getDownloadedThemes,
} = window.stahp;

const lengthOptions = [
  { label: "20 minutes", value: 20 * 60 },
  { label: "30 minutes", value: 30 * 60 },
  { label: "45 minutes", value: 45 * 60 },
  { label: "1 hour", value: 60 * 60 },
  { label: "2 hours", value: 2 * 60 * 60 },
];

const forOptions = [
  { label: "1 minute", value: 1 * 60 },
  { label: "2 minutes", value: 2 * 60 },
  { label: "3 minutes", value: 3 * 60 },
  { label: "4 minutes", value: 4 * 60 },
  { label: "5 minutes", value: 5 * 60 },
  { label: "7 minutes", value: 7 * 60 },
  { label: "10 minutes", value: 10 * 60 },
  { label: "15 minutes", value: 15 * 60 },
];

function ActivityForm({
  value,
  setValue,
  themes,
}: {
  value: IActivitySettings;
  setValue: (value: IActivitySettings) => void;
  themes: IThemePackage[];
}) {
  return (
    <Form
      value={value}
      onChange={(nextValue, { touched }) => {
        setValue(nextValue);
      }}
    >
      <Box gap="medium">
        <Box gap="medium">
          <Box direction="row" align="center" gap="small">
            <Box align="center" justify="center" direction="row">
              <CheckBox
                toggle
                checked={value.enabled}
                onChange={() => setValue({ ...value, enabled: !value.enabled })}
              />
            </Box>
            <Text>Take a long break</Text>
            <SelectSmall
              options={lengthOptions}
              labelKey="label"
              valueKey={{ key: "value", reduce: true }}
              size="small"
              value={[value.activeTargetTime]}
              onChange={(e) =>
                setValue({
                  ...value,
                  activeTargetTime: parseInt(e.target.value),
                })
              }
            />
            <Text>for</Text>
            <SelectSmall
              options={forOptions}
              labelKey="label"
              valueKey={{ key: "value", reduce: true }}
              size="small"
              value={[value.longBreakTargetTime]}
              margin={{ right: "small" }}
              onChange={(e) =>
                setValue({
                  ...value,
                  longBreakTargetTime: parseInt(e.target.value),
                })
              }
            />
          </Box>
          <Box align="center" justify="start" direction="row" gap="small">
            <Text>Use theme</Text>
            <Select
              options={themes}
              labelKey="name"
              valueKey={{ key: "name", reduce: true }}
              value={[value.theme]}
              onChange={(e) =>
                setValue({
                  ...value,
                  theme: e.target.value,
                })
              }
              size="small"
            />
          </Box>
        </Box>
        {themes && themes.length == 1 && (
          <Card elevation="none" background={{ color: "background-contrast" }}>
            <CardBody>
              <Box direction="row" gap="xsmall" align="center">
                <Text size="small" weight="bold">
                  💡 You only one have theme download them by clicking on the
                  themes tab
                </Text>
              </Box>
            </CardBody>
          </Card>
        )}
      </Box>
    </Form>
  );
}

function TimeLeft() {
  const [seconds, setLeft] = useState(0);

  useEffect(() => {
    const updateTime = async () => {
      const targetTime = await getActiveTargetTime();
      const time = await getActiveTime();

      setLeft(targetTime - time);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [getActiveTargetTime, getActiveTime]);

  return (
    <Text size="small">
      {formatDuration(
        { seconds },
        { zero: true, format: ["hours", "minutes", "seconds"] }
      )}{" "}
      left until next break
    </Text>
  );
}

export default function Activity() {
  const [settings, setSettings] = useState<IActivitySettings>(null);
  const [themes, setThemes] = useState<IThemePackage[]>(null);

  useEffect(() => {
    const fetch = async () => {
      const settings = await getActivitySettings();
      const themes = await getDownloadedThemes();

      setThemes(themes);
      setSettings(settings);
    };

    fetch();
  }, [getActivitySettings]);

  const onChange = async (settings: IActivitySettings) => {
    const updated = await setActivitySettings(settings);
    setSettings(updated);
  };

  return (
    <Box
      align="stretch"
      justify="center"
      direction="column"
      pad={{ top: "small" }}
    >
      <Box direction="row" justify="between" align="center">
        <Heading level="2" size="small">
          Activity breaks
        </Heading>
        {settings &&
          (settings.enabled ? (
            <TimeLeft />
          ) : (
            <Text size="small">Long breaks disabled</Text>
          ))}
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
          <ActivityForm themes={themes} value={settings} setValue={onChange} />
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
          label="Take a long break now"
          secondary
          onClick={() => takeLongBreak()}
        />
      </Box>
    </Box>
  );
}
