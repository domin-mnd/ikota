import type { IkotaConfig } from "../types";
import styledComponents from "./styling/styles";
import { readFileSync } from "fs";
import { join } from "path";

export function createStyles(config: IkotaConfig): string {
  if (config.preprocessor === "styled-components") {
    return styledComponents;
  } else if (config.preprocessor !== "tailwind-css") {
    return readFileSync(
      join(
        __dirname,
        "./styling/styles.module." +
        config.preprocessor?.slice(0, 4)
      )
    ) as unknown as string;
  } else {
    return "";
  }
}