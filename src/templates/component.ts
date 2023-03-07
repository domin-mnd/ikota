import type { IkotaConfig, IkotaPlugin } from "../types";
import { ux } from "@oclif/core";
import color from "@oclif/color";
import { componentWithModuleStyles } from "./components/module";
import { componentWithStyledComponents } from "./components/styled-components";
import { componentWithTailwindCSS } from "./components/tailwind";
import { componentWithoutStyling } from "./components/none";

/**
 * Create component function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @param {string} name Name of the component
 * @returns {string} string used to copy & paste to the file
 */
export async function createComponent(config: IkotaConfig, name: string): Promise<string> {
  let response: string = "";

  if (config.useTypescript) {
    response +=
      'import type { FunctionComponent, ReactElement } from "react";\n';
  }

  if (config.addConfigFile) {
    response += 'import { buttonLabel } from "./config"\n';
  }

  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
      response += componentWithModuleStyles(config, name);
      break;
    case "styled-components":
      response += componentWithStyledComponents(config, name);
      break;
    case "tailwind-css":
      response += componentWithTailwindCSS(config, name);
      break;
    case "none":
      response += componentWithoutStyling(config, name);
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
              response += pluginWithPreprocessor.components[
                config.preprocessor
              ].component.function(config, name);
              return response;
            }
          }
        }
      }

      ux.error(
        "Invalid preprocessor was provided: " + color.red(config.preprocessor)
      );
  }
  return response;
}
