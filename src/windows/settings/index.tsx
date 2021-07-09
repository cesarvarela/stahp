import React from "react";
import ReactDOM from "react-dom";
import { IStahp } from "../../interfaces";
import Settings from "../../components/Settings";

declare global {
  interface Window {
    stahp: IStahp;
  }
}

ReactDOM.render(<Settings />, document.getElementById("root"));
