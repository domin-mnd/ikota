import type { IkotaConfig, IkotaPlugin } from "../types";
import styledComponents from "./styling/styles";
import { readFileSync } from "fs";
import { join } from "path";
import { ux } from "@oclif/core";
import color from "@oclif/color";

/**
 * Create styles function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @returns {string} string used to copy & paste to the file
 */
export async function createStyles(config: IkotaConfig, name: string): Promise<string> {
  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
      return readFileSync(
        join(
          __dirname,
          "./styling/styles.module." + config.preprocessor?.slice(0, 4)
        )
      ) as unknown as string;

    case "styled-components":
      return styledComponents;

    case "tailwind-css":
    case "none":
      return "";
    
    default:
      if (config.plugins && config.preprocessor) {
        for (let i in config.plugins) {
          const pluginWithPreprocessor: IkotaPlugin = await import(config.plugins[i]);

          if (pluginWithPreprocessor.components) {
            if (
              Object.keys(pluginWithPreprocessor.components).includes(
                config.preprocessor
              )
            ) {
              return pluginWithPreprocessor.components[
                config.preprocessor
              ].style(config, name);
            }
          }
        }
      }

      ux.error(
        "Invalid preprocessor was provided: " + color.red(config.preprocessor)
      );
  }
}
