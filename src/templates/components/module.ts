import type { IkotaConfig } from "../../types";
import { capitalCase } from "../../utils/capitalCase";

export function componentWithModuleStyles(
  config: IkotaConfig,
  name: string
): string {
  // File extension is similar to preprocessor selected
  // However stylus' file ext is styl, so we slice
  let response = `import classes from "./styles.module.${
    config.preprocessor?.slice(0, 4)
  }";\n`;

  if (config.useTypescript) response += 'import type { FunctionComponent, ReactElement } from "react";\n';
  if (config.addConfigFile) response += 'import { buttonLabel } from "./config";\n';

  response += "\n";

  if (config?.useLambdaSimplifier) {
    response += [
      `export const ${capitalCase(name)}${
        config.useTypescript
          ? ": FunctionComponent = (): ReactElement"
          : " = ()"
      } => (`,
      "  <div className={classes.box}>",
      `    <button className={classes.button}>${
        config.addConfigFile ? "{buttonLabel}" : "Button"
      }</button>`,
      "  </div>",
      ");",
    ].join("\n");
  } else {
    response += [
      `export const ${capitalCase(name)}${
        config.useTypescript
          ? ": FunctionComponent = (): ReactElement"
          : " = ()"
      } => {`,
      "  return (",
      "    <div className={classes.box}>",
      `      <button className={classes.button}>${
        config.addConfigFile ? "{buttonLabel}" : "Button"
      }</button>`,
      "    </div>",
      "  );",
      "}",
    ].join("\n");
  }

  return response;
}
