import React from "react";
import { Main, Button } from "grommet";

const { takeLongBreak } = window.stahp;

export default function Activity() {
  return (
    <Main
      fill="vertical"
      overflow="auto"
      flex
      direction="column"
      justify="start"
      align="stretch"
    >
      <Button onClick={() => takeLongBreak()}>Take long break</Button>
    </Main>
  );
}
