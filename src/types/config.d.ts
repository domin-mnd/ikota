/** CSS preprocessor used for styling */
export type SupportedPreprocessor =
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
  preprocessor?: SupportedPreprocessor;
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
}
