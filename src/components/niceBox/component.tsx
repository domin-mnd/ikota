import type { FunctionComponent, ReactElement } from "react";
import { buttonLabel } from "./config"
import classes from "./styles.module.sass";

export const NiceBox: FunctionComponent = (): ReactElement => (
  <div className={classes.box}>
    <button className={classes.button}>{buttonLabel}</button>
  </div>
)
