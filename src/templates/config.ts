import type { IkotaConfig } from "../types";

/**
 * Create config function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @returns {string} string used to copy & paste to the file
 */
export function createConfig(config: IkotaConfig): string {
  return config.useTypescript
    ? 'export const buttonLabel: string = "Button";'
    : 'export const buttonLabel = "Button";';
}
