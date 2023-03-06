import type { IkotaConfig, IkotaPlugin } from "../types";
import color from "@oclif/color";
import { ux } from "@oclif/core";

/**
 * Create config function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @returns {string} string used to copy & paste to the file
 */
export async function createConfig(config: IkotaConfig, name: string): Promise<string> {
  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
    case "styled-components":
    case "tailwind-css":
    case "none":
      return config.useTypescript
        ? 'export const buttonLabel: string = "Button";'
        : 'export const buttonLabel = "Button";';
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
              ].config(config, name);
            }
          }
        }
      }

      ux.error(
        "Invalid preprocessor was provided: " + color.red(config.preprocessor)
      );
  }
}
