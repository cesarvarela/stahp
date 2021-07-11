import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Text,
  CardBody,
  Box,
  Select as GrommetSelect,
  CheckBox,
  Spinner,
  Form,
  Button,
  CardFooter,
} from "grommet";
import { IActivitySettings } from "../interfaces";
import styled from "styled-components";
import { formatDuration } from "date-fns";

const Select = styled(GrommetSelect)`
  width: 100px;
`;

const {
  takeIndefiniteBreak,
  takeLongBreak,
  getActivitySettings,
  setActivitySettings,
  getActiveTargetTime,
  getActiveTime,
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
}: {
  value: IActivitySettings;
  setValue: (value: IActivitySettings) => void;
}) {
  return (
    <Form
      value={value}
      onChange={(nextValue, { touched }) => {
        setValue(nextValue);
      }}
    >
      <Box direction="row" align="center">
        <Box
          align="center"
          justify="center"
          margin={{ right: "small" }}
          direction="row"
        >
          <CheckBox
            toggle
            checked={value.enabled}
            onChange={() => setValue({ ...value, enabled: !value.enabled })}
          />
        </Box>
        <Text margin={{ right: "small" }}>Take a long break</Text>
        <Select
          options={lengthOptions}
          labelKey="label"
          valueKey={{ key: "value", reduce: true }}
          size="small"
          value={[value.activeTargetTime]}
          margin={{ right: "small" }}
          onChange={(e) =>
            setValue({
              ...value,
              activeTargetTime: parseInt(e.target.value),
            })
          }
        />
        <Text margin={{ left: "small", right: "small" }}>for</Text>
        <Select
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
    <Text>
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

  useEffect(() => {
    const fetch = async () => {
      const settings = await getActivitySettings();

      setSettings(settings);
    };

    fetch();
  }, [getActivitySettings]);

  const onChange = async (settings: IActivitySettings) => {
    const updated = await setActivitySettings(settings);
    setSettings(updated);
    console.log("submit", updated);
  };

  return (
    <Box
      align="stretch"
      justify="center"
      direction="column"
      pad={{ top: "small" }}
    >
      {settings == null ? (
        <Box align="center" justify="center" pad="large">
          <Spinner size="medium" />
        </Box>
      ) : (
        <Card background={{ color: "background" }}>
          <CardHeader
            align="center"
            direction="row"
            flex={false}
            justify="between"
            gap="medium"
            pad="small"
          >
            <Text size="small" weight="bold">
              Activity breaks
            </Text>
          </CardHeader>
          <CardBody pad="small" direction="row" align="center">
            <ActivityForm value={settings} setValue={onChange} />
          </CardBody>
          <CardFooter
            align="center"
            direction="row"
            pad="small"
            background={{ color: "active" }}
          >
            {settings.enabled ? (
              <TimeLeft />
            ) : (
              <Text>Long breaks disabled</Text>
            )}
          </CardFooter>
        </Card>
      )}
      <Box
        align="center"
        justify="start"
        direction="row"
        margin={{ top: "medium" }}
        gap="small"
      >
        <Button label="Take a long break now" onClick={() => takeLongBreak()} />
        <Button
          label="Take an indefinite break now"
          onClick={() => takeIndefiniteBreak()}
        />
      </Box>
    </Box>
  );
}
