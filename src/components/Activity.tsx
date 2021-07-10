import React from "react";
import { Main, Button } from "grommet";

const { block, unblock } = window.stahp;

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
      <Button onClick={() => block()}>Test Block</Button>
    </Main>
  );
}
