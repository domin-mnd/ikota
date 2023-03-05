import { IkotaConfig } from "../types";

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