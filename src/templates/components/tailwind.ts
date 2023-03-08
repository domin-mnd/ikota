import type { IkotaConfig } from "../../types";
import { capitalCase } from "../../utils/capitalCase";

export function componentWithTailwindCSS(
  config: IkotaConfig,
  name: string
): string {
  let response: string = "";

  if (config.useTypescript) response += 'import type { FunctionComponent, ReactElement } from "react";\n';
  if (config.addConfigFile) response += 'import { buttonLabel } from "./config";\n';

  if (config.addConfigFile || config.useTypescript) response += "\n";

  if (config?.useLambdaSimplifier) {
    response += [
      `\nexport const ${capitalCase(name)}${
        config.useTypescript
          ? ": FunctionComponent = (): ReactElement"
          : " = ()"
      } => (`,
      '  <div className="p-4">',
      `    <button className="appearance-none">${
        config.addConfigFile ? "{buttonLabel}" : "Button"
      }</button>`,
      "  </div>",
      ");",
    ].join("\n");
  } else {
    response += [
      `\nexport const ${capitalCase(name)}${
        config.useTypescript
          ? ": FunctionComponent = (): ReactElement"
          : " = ()"
      } => {`,
      "  return (",
      '    <div className="p-4">',
      `      <button className="appearance-none">${
        config.addConfigFile ? "{buttonLabel}" : "Button"
      }</button>`,
      "    </div>",
      "  );",
      "}",
    ].join("\n");
  }

  return response;
}
