import type { IkotaConfig } from "../types";
import { capitalCase } from "../utils/capitalCase";
import { ux } from "@oclif/core";
import color from "@oclif/color";

export function parseTypescriptWithPreprocessor(config: IkotaConfig, name: string) {
  let response: string = "";

  if (config.addConfigFile) {
    response += 'import { buttonLabel } from "./config"\n';
  }

  switch (config.preprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
      // File extension is similar to preprocessor selected
      // However stylus' file ext is styl, so we slice
      response +=
        `import classes from "./styles.module.${config.preprocessor.slice(0, 4)}";\n\n`;
      
      if (config?.useLambdaSimplifier) {
        response += [
          `export const ${capitalCase(name)} = () => (`,
          "  <div className={classes.box}>",
          `    <button className={classes.button}>${config.addConfigFile ? "{buttonLabel}" : "Button"}</button>`,
          "  </div>",
          ")"
        ].join("\n");
      } else {
        response += [
          `export const ${capitalCase(name)} = () => {`,
          "  return (",
          "    <div className={classes.box}>",
          `      <button className={classes.button}>${config.addConfigFile ? "{buttonLabel}" : "Button"}</button>`,
          "    </div>",
          "  );",
          "}"
        ].join("\n");
      }
      break;

    case "styled-components":
      response += 'import { Container, Button } from "./styles";\n\n';

      if (config?.useLambdaSimplifier) {
        response += [
          `export const ${capitalCase(name)} = () => (`,
          "  <Container>",
          `    <Button>${config.addConfigFile ? "{buttonLabel}" : "Button"}</Button>`,
          "  </Container>",
          ")"
        ].join("\n");
      } else {
        response += [
          `export const ${capitalCase(name)} = () => {`,
          "  return (",
          "    <Container>",
          `      <Button>${config.addConfigFile ? "{buttonLabel}" : "Button"}</Button>`,
          "    </Container>",
          "  );",
          "}"
        ].join("\n");
      }
      break;
    
    case "tailwind-css":
      if (config?.useLambdaSimplifier) {
        response += [
          `export const ${capitalCase(name)} = () => (`,
          '  <div className="p-4">',
          `    <button className="appearance-none">${config.addConfigFile ? "{buttonLabel}" : "Button"}</button>`,
          "  </div>",
          ")"
        ].join("\n");
      } else {
        response += [
          `export const ${capitalCase(name)} = () => {`,
          "  return (",
          '    <div className="p-4">',
          `      <button className="appearance-none">${config.addConfigFile ? "{buttonLabel}" : "Button"}</button>`,
          "    </div>",
          "  );",
          "}"
        ].join("\n");
      }
      break;
    default:
      ux.error("Invalid preprocessor was provided: " + color.red(config.preprocessor))
  }
  return response;
}