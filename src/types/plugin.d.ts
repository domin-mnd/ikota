import type { IkotaConfig } from "./config";

/** Executable to run for certain files */
export type ExecutablePlug = (config: IkotaConfig, name: string) => string;

/** Functions to run when generating components for certain files */
export interface ComponentPlug {
  /** Styling file returning string */
  style: ExecutablePlug;
  /** Main component file returning string */
  component: ExecutablePlug;
  /** Exporting file returning string */
  index: ExecutablePlug;
  /** Configuration file returning string */
  config: ExecutablePlug;
}

/** A "preprocessor" to add as a template */
export interface Component {
  /** Preprocessor where key is name of it */
  [key: string]: ComponentPlug;
}

/** A config used to generate components */
export interface IkotaPlugin {
  /** An array of components to add */
  components?: Component;
}
