import type { IkotaConfig } from "../types";

/**
 * Create index function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @returns {string} string used to copy & paste to the file
 */
export function createIndex(config: IkotaConfig): string {
  let response: string = 'export * from "./component"';

  if (config.addConfigFile) {
    response += '\nexport * from "./config"';
  }

  if (config.preprocessor === "styled-components") {
    response += '\nexport * from "./styles"';
  }

  return response;
}
