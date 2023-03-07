import type { IkotaConfig, IkotaPlugin } from "../types";
import color from "@oclif/color";
import { ux } from "@oclif/core";
import { statSync, writeFileSync } from "fs";

/**
 * Create styles file using the content & its name
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @param {string} name Name of the component
 * @param {string} content Content of the file
 * @returns {Promise<void>} Creates a file with styles
 */
export async function createStylesFile(
  config: IkotaConfig,
  name: string,
  content: string
): Promise<void> {
  // A path for file creation
  let path: string;

  // Create styles file
  pathDetermine:
  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
      path = `${config.componentPath || "."}/${
        name
      }/styles.module.${config.preprocessor?.slice(0, 4)}`;
      break;

    case "styled-components":
      path = `${config.componentPath || "."}/${name}/styles.${
        config.useTypescript ? "ts" : "js"
      }`;
      break;

    case "none":
    case "tailwind-css":
      path = "";
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
                pluginWithPreprocessor.components[config.preprocessor]
                  .style.fileName(config, name)
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
