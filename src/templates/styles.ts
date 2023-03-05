import type { IkotaConfig } from "../types";
import styledComponents from "./styling/styles";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Create styles function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @returns {string} string used to copy & paste to the file
 */
export function createStyles(config: IkotaConfig): string {
  if (config.preprocessor === "styled-components") {
    return styledComponents;
  } else if (config.preprocessor !== "tailwind-css") {
    return readFileSync(
      join(
        __dirname,
        "./styling/styles.module." + config.preprocessor?.slice(0, 4)
      )
    ) as unknown as string;
  } else {
    return "";
  }
}
