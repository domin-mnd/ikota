import type { IkotaConfig } from "../types";

export function createConfig(config: IkotaConfig): string {
  return config.useTypescript
    ? 'export const buttonLabel: string = "Button";'
    : 'export const buttonLabel = "Button";';
}
