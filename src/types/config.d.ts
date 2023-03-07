import { IkotaPlugin } from "./plugin";

/** CSS preprocessor used for styling */
export type SupportedNativePreprocessor =
  | "none"
  | "css"
  | "sass"
  | "scss"
  | "less"
  | "tailwind-css"
  | "stylus"
  | "styled-components";

/** A config used to generate components */
export interface IkotaConfig {
  /** A path where component folders are stored, e.g. "src/component" */
  componentPath?: string;
  /** Use typescript in the project. Defines whether to use JS or TS */
  useTypescript?: boolean;
  /** Add additional config.ts/js file in the component folder */
  addConfigFile?: boolean;
  /** Add index.ts/js file that exports everything from the folder */
  addIndexFile?: boolean;
  /** CSS preprocessor used for styling */
  preprocessor?: SupportedNativePreprocessor;
  /**
   * A way to write lambda functions
   * @example
   * () => (
   *   [component]
   * ) // Simplified
   * @example
   * () => {
   *   return (
   *     [component]
   *   )
   * } // Not simplified
   */
  useLambdaSimplifier?: boolean;
  /** Trailing space at the end of every component's file */
  trailingSpace?: boolean;
  /**
   * Ikota plugins array with modules to import
   * @example
   * const ikotaExample = require("@ikota/example");
   * 
   * module.exports = {
   *   plugins: [ikotaExample]
   * }
   */
  plugins?: IkotaPlugin[];

  /** Plugin custom options */
  other?: {
    [key: string]: any;
  }
}
