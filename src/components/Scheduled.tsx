import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Form,
  FormField,
  Select,
  CheckBoxGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner,
  Heading,
} from "grommet";
import { Add, Trash } from "grommet-icons";
import styled from "styled-components";
import { ISchedule, IScheduleSettings } from "../interfaces";

const { saveSchedulerSettings, getSchedulerSettings } = window.stahp;

const TimeSelect = styled(Select)`
  width: 40px;
`;

const days = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

const hours = [...Array(24).keys()].map((n) => ({
  label: n.toString().padStart(2, "0"),
  value: n,
}));
const minutes = [...Array(60).keys()].map((n) => ({
  label: n.toString().padStart(2, "0"),
  value: n,
}));

function Schedule({
  value,
  onChange,
  onDelete,
  index,
}: {
  value: ISchedule;
  onChange: (value: unknown) => void;
  onDelete: () => void;
  index: number;
}) {
  return (
    <Card
      background={{ color: "background-front" }}
      margin={{ top: index > 0 ? "small" : undefined }}
      elevation="none"
    >
      <CardHeader pad="small">
        <Heading level="4" size="small">
          Scheduled Break
        </Heading>
      </CardHeader>
      <CardBody pad="xsmall" align="start" gap="medium">
        <Box direction="row" pad="small" gap="small">
          <Text>Take a break every</Text>
          <CheckBoxGroup
            options={days}
            direction="row"
            labelKey="label"
            valueKey="value"
            value={value.days}
            onChange={(e) => onChange({ value: { ...value, days: e.value } })}
          />
        </Box>
        <Box pad="small" direction="row" gap="small" align="center">
          <Text>At</Text>
          <TimeSelect
            labelKey="label"
            valueKey={{ key: "value", reduce: true }}
            options={hours}
            size="small"
            value={[value.hour]}
            onChange={(e) =>
              onChange({ value: { ...value, hour: parseInt(e.value) } })
            }
          />
          <TimeSelect
            labelKey="label"
            valueKey={{ key: "value", reduce: true }}
            options={minutes}
            size="small"
            value={[value.minutes]}
            onChange={(e) =>
              onChange({ value: { ...value, minutes: parseInt(e.value) } })
            }
          />
        </Box>
      </CardBody>
      <CardFooter
        align="center"
        direction="row"
        flex={false}
        justify="between"
        gap="medium"
        pad="small"
        background={{ color: "background-contrast" }}
      >
        <Button
          size="small"
          label="Delete"
          plain
          icon={<Trash size="small" />}
          onClick={onDelete}
        />
      </CardFooter>
    </Card>
  );
}

function Schedules({
  onChange,
  value,
}: {
  onChange: (value: unknown) => void;
  value: ISchedule[];
}) {
  const defaultSchedule: ISchedule = {
    days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    hour: 22,
    minutes: 0,
  };

  const onAddClick = () => {
    onChange({
      value: [
        ...value,
        { id: `schedule-${value.length + 1}`, ...defaultSchedule },
      ],
    });
  };

  const onScheduleChange = ({ value: schedule }: { value: ISchedule }) => {
    onChange({
      value: value.map((l) => (l.id === schedule.id ? schedule : l)),
    });
  };

  const onDeleteSchedule = (schedule: ISchedule) => {
    onChange({ value: value.filter((v) => v.id !== schedule.id) });
  };

  return (
    <>
      <Box>
        {value.map((v, i) => (
          <Schedule
            index={i}
            key={v.id}
            value={v}
            onChange={onScheduleChange}
            onDelete={() => onDeleteSchedule(v)}
          />
        ))}
      </Box>

      {value.length > 0 ? (
        <Box align="center" justify="center" pad="medium">
          <Button label="Add another scheduled break" onClick={onAddClick} />
        </Box>
      ) : (
        <Box
          align="center"
          justify="center"
          pad="large"
          background={{ color: "background-contrast" }}
          round="small"
          direction="row"
          style={{ cursor: "pointer" }}
          onClick={onAddClick}
        >
          <Box align="center" justify="center" pad="medium">
            <Button icon={<Add />} plain size="large" />
          </Box>
          <Text>
            Click here to add a scheduled break that repeats daily/weekly and at
            specific time.
          </Text>
        </Box>
      )}
    </>
  );
}

function ScheduleForm({
  value,
  setValue,
}: {
  value: IScheduleSettings;
  setValue: (value: IScheduleSettings) => void;
}) {
  return (
    <Form
      value={value}
      onChange={(nextValue, { touched }) => {
        setValue(nextValue);
      }}
    >
      <FormField name="schedules" component={Schedules} />
    </Form>
  );
}

export default function Scheduled() {
  const [settings, setSettings] = useState<IScheduleSettings>(null);

  useEffect(() => {
    async function load() {
      const data = await getSchedulerSettings();
      setSettings(data);
    }

    load();
  }, [getSchedulerSettings]);

  const onChange = async (settings: IScheduleSettings) => {
    setSettings(settings);
    saveSchedulerSettings(settings);
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
        <ScheduleForm value={settings} setValue={onChange} />
      )}
    </Box>
  );
}
