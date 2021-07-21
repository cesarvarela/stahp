import React from "react";
import { Card, CardHeader, Text, CardBody, Box, Button } from "grommet";

const { takeLongBreak } = window.stahp;

export default function Themes() {
  return (
    <Box
      align="stretch"
      justify="center"
      direction="column"
      pad={{ top: "small" }}
    >
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
            Available Themes
          </Text>
        </CardHeader>
        <CardBody pad="small" direction="row" align="center">
          stahp-theme-default
        </CardBody>
      </Card>
      <Box
        align="center"
        justify="start"
        direction="row"
        margin={{ top: "medium" }}
        gap="small"
      >
        <Button
          label="Open long break window in dev mode"
          onClick={() => takeLongBreak(true)}
        />
      </Box>
    </Box>
  );
}
