import { parseTypescriptWithPreprocessor } from "../parsers/typescript";
import type { IkotaConfig } from "../types";

export const createComponent = (config: IkotaConfig, name: string): string => {
  let response: string = "";

  response += parseTypescriptWithPreprocessor(config, name);

  return response;
}