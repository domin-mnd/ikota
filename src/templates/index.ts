import type { IkotaConfig, IkotaPlugin } from "../types";
import color from "@oclif/color";
import { ux } from "@oclif/core";

/**
 * Create index function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @returns {string} string used to copy & paste to the file
 */
export async function createIndex(config: IkotaConfig, name: string): Promise<string> {
  let response: string = 'export * from "./component"';

  if (config.addConfigFile) {
    response += '\nexport * from "./config"';
  }

  if (config.preprocessor === "styled-components") {
    response += '\nexport * from "./styles"';
  }

  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
    case "styled-components":
    case "tailwind-css":
    case "none":
      return response;
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
              ].index(config, name);
            }
          }
        }
      }

      ux.error(
        "Invalid preprocessor was provided: " + color.red(config.preprocessor)
      );
  }
}
