import type { IkotaConfig } from "../../types";
import { capitalCase } from "../../utils/capitalCase";

export function componentWithStyledComponents(
  config: IkotaConfig,
  name: string
): string {
  let response = 'import { Container, Button } from "./styles";\n';

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
      "  <Container>",
      `    <Button>${
        config.addConfigFile ? "{buttonLabel}" : "Button"
      }</Button>`,
      "  </Container>",
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
      "    <Container>",
      `      <Button>${
        config.addConfigFile ? "{buttonLabel}" : "Button"
      }</Button>`,
      "    </Container>",
      "  );",
      "}",
    ].join("\n");
  }

  return response;
}
