import type { IkotaConfig } from "../types";
import { capitalCase } from "../utils/capitalCase";
import { ux } from "@oclif/core";
import color from "@oclif/color";

/**
 * Create component function used to generate a string to write file as
 * @param {IkotaConfig} config Ikota configuration (may also be from flags)
 * @param {string} name Name of the component
 * @returns {string} string used to copy & paste to the file
 */
export function createComponent(config: IkotaConfig, name: string): string {
  let response: string = "";

  if (config.useTypescript) {
    response +=
      'import type { FunctionComponent, ReactElement } from "react";\n';
  }

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
      response += `import classes from "./styles.module.${config.preprocessor.slice(
        0,
        4
      )}";\n\n`;

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
          ")",
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
      break;

    case "styled-components":
      response += 'import { Container, Button } from "./styles";\n\n';

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
          ")",
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
      break;

    case "tailwind-css":
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
          ")",
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
      break;
    case "none":
      if (config?.useLambdaSimplifier) {
        response += [
          `\nexport const ${capitalCase(name)}${
            config.useTypescript
              ? ": FunctionComponent = (): ReactElement"
              : " = ()"
          } => (`,
          "  <div>",
          `    <button>${
            config.addConfigFile ? "{buttonLabel}" : "Button"
          }</button>`,
          "  </div>",
          ")",
        ].join("\n");
      } else {
        response += [
          `\nexport const ${capitalCase(name)}${
            config.useTypescript
              ? ": FunctionComponent = (): ReactElement"
              : " = ()"
          } => {`,
          "  return (",
          "    <div>",
          `      <button>${
            config.addConfigFile ? "{buttonLabel}" : "Button"
          }</button>`,
          "    </div>",
          "  );",
          "}",
        ].join("\n");
      }
      break;
    default:
      ux.error(
        "Invalid preprocessor was provided: " + color.red(config.preprocessor)
      );
  }
  return response;
}
