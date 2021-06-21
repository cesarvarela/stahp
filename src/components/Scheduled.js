import React, { useEffect, useState } from 'react'
import { Box, Main, Text, Form, FormField, Select, CheckBoxGroup, Button } from 'grommet'
import { Add, Trash } from 'grommet-icons'
import styled from 'styled-components'

const { saveSchedulerSettings, getSchedulerSettings } = window.stahp

const Label = styled(Text)`
    width: 140px;
    text-align: left;
`

const TimeSelect = styled(Select)`
    width: 80px;
`
const ScheduleBox = styled(Box)`
    position: relative;
    & > .trash {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
    }
    &:hover > .trash {
        display: block;
    }
`

const days = [
    { label: 'M', value: 'monday' },
    { label: 'T', value: 'tuesday' },
    { label: 'W', value: 'wednesday' },
    { label: 'T', value: 'thursday' },
    { label: 'F', value: 'friday' },
    { label: 'S', value: 'saturday' },
    { label: 'S', value: 'sunday' },
]

const hours = [...Array(24).keys()].map(n => ({ label: n.toString().padStart(2, '0'), value: n }))
const minutes = [...Array(60).keys()].map(n => ({ label: n.toString().padStart(2, '0'), value: n }))

function Schedule({ value, onChange, onDelete }) {

    return <ScheduleBox align="start" justify="start" round="small" background={{ "color": "light-1" }} fill="horizontal" margin="small">
        <Box align="center" justify="between" direction="row" flex="grow" margin="medium">
            <Label>
                Days
            </Label>
            <FormField>
                <CheckBoxGroup
                    options={days}
                    direction="row"
                    labelKey="label"
                    valueKey="value"
                    value={value.days} onChange={e => onChange({ value: { ...value, days: e.value } })}
                />
            </FormField>
        </Box>
        <Box align="start" justify="between" direction="row" flex="grow" margin="medium">
            <Label>
                Time
            </Label>
            <FormField>
                <TimeSelect
                    labelKey="label"
                    valueKey={{ key: "value", reduce: true }}
                    options={hours}
                    size="medium"
                    value={value.hour}
                    onChange={e => onChange({ value: { ...value, hour: e.value } })}
                />
            </FormField>
            <FormField>
                <TimeSelect
                    labelKey="label"
                    valueKey={{ key: "value", reduce: true }}
                    options={minutes}
                    size="medium"
                    value={value.minutes}
                    onChange={e => onChange({ value: { ...value, minutes: e.value } })}
                />
            </FormField>
        </Box>
        <Button className="trash" icon={<Trash />} plain onClick={onDelete} />
    </ScheduleBox>
}

function Schedules({ onChange, value }) {

    const defaultSchedule = {
        days: [],
        hour: '',
        minutes: '',
    }

    const onAddClick = () => {
        onChange({ value: [...value, { id: `schedule-${value.length + 1}`, ...defaultSchedule }] })
    }

    const onScheduleChange = ({ value: schedule }) => {
        onChange({ value: value.map(l => l.id === schedule.id ? schedule : l) })
    }

    const onDeleteSchedule = (schedule) => {

        onChange({ value: value.filter(v => v.id !== schedule.id) })
    }

    return <Box margin="medium" justify="start" align="start">
        {value.map(v => <Schedule key={v.id} value={v} onChange={onScheduleChange} onDelete={() => onDeleteSchedule(v)} />)}
        <Button icon={<Add />} onClick={onAddClick} label="Add Scheduled break" />
    </Box>
}

function ScheduleForm({ value, setValue, defaultValue, onSubmit }) {

    return <Form
        value={value}
        onChange={(nextValue, { touched }) => {
            setValue(nextValue);
        }}
        onReset={() => setValue(defaultValue)}
        onSubmit={onSubmit}
    >
        <FormField name="schedules" component={Schedules} />
    </Form>
}

export default function Scheduled() {

    const [settings, setSettings] = useState({ schedules: [] })

    useEffect(() => {

        async function load() {

            const data = await getSchedulerSettings()
            setSettings(data)
        }

        load()

    }, [])

    const onChange = async (settings) => {

        setSettings(settings)
        saveSchedulerSettings(settings)
        console.log('submit', settings)
    }

    return <Main fill="vertical" overflow="auto" flex direction="column" justify="start" align="stretch">
        <ScheduleForm value={settings} setValue={onChange} />
    </Main>
}
