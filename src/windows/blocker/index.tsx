import React from "react";
import ReactDOM from "react-dom";
import { IStahpBlocker } from "../../interfaces";
import Blocker from "../../components/Blocker";

declare global {
  interface Window {
    stahpblocker: IStahpBlocker;
  }
}

ReactDOM.render(<Blocker />, document.getElementById("root"));
