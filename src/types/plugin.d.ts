import type { IkotaConfig } from "./config";

/** Executable to run for certain files */
export type ExecutablePlug = (config: IkotaConfig, name: string) => string;

/** A wrapper interface to add the fileName */
export interface FilePlug {
  fileName: ExecutablePlug;
  function: ExecutablePlug;
}

/** Functions to run when generating components for certain files */
export interface ComponentPlug {
  /** Styling file returning string */
  style: FilePlug;
  /** Main component file returning string */
  component: FilePlug;
  /** Exporting file returning string */
  index: FilePlug;
  /** Configuration file returning string */
  config: FilePlug;

  /** Soon to rewrite the plug for creating any file */
  [key: string]: ExecutablePlug;
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
