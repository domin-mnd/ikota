import type { IkotaConfig, IkotaPlugin } from "../types";
import color from "@oclif/color";
import { ux } from "@oclif/core";
import { statSync, writeFileSync } from "fs";

/**
 * Create config file using the content & its name
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @param {string} name Name of the component
 * @param {string} content Content of the file
 * @returns {Promise<void>} Creates a file with configuration
 */
export async function createConfigFile(
  config: IkotaConfig,
  name: string,
  content: string
): Promise<void> {
  // A path for file creation
  let path: string;

  // Create main component file
  pathDetermine:
  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
    case "styled-components":
    case "tailwind-css":
    case "none":
      path = `${config.componentPath || "."}/${name}/config.${
        config.useTypescript ? "ts" : "js"
      }`;
      break;

    default:
      if (config.plugins && config.preprocessor) {
        for (let i in config.plugins) {
          const pluginWithPreprocessor: IkotaPlugin = config.plugins[i];

          if (pluginWithPreprocessor.components) {
            if (
              Object.keys(pluginWithPreprocessor.components).includes(
                config.preprocessor
              )
            ) {
              path = `${config.componentPath || "."}/${name}/${
                pluginWithPreprocessor.components[config.preprocessor].config
                  .fileName(config, name)
              }`;
              break pathDetermine;
            }
          }
        }
      }

      ux.error(
        "Invalid preprocessor was provided: " + color.red(config.preprocessor)
      );
  }
  
  if (path !== "") {
    writeFileSync(path, content);
    ux.log(
      `Created ${color.cmd(path)} file ${color.blackBright(
        statSync(path).size + "B"
      )}`
    );
  }
}
