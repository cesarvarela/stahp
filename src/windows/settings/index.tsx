import React from "react";
import ReactDOM from "react-dom";
import { IStahp } from "../../interfaces";
import Settings from "../../components/Settings";
import * as Sentry from "@sentry/electron/dist/renderer";

Sentry.init({
  dsn: "https://0a6134a5d89d40c4954c6144b0e63c64@o944978.ingest.sentry.io/5893671",
});

declare global {
  interface Window {
    stahp: IStahp;
  }
}

ReactDOM.render(<Settings />, document.getElementById("root"));
