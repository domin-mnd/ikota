import type { IkotaConfig } from "../../types";

export default (config: IkotaConfig): string => {
  let response: string = "";

  switch (config.addPreprocessor) {
    case "css":
    case "less":
    case "sass":
    case "scss":
    case "stylus":
      // File extension is similar to preprocessor selected
      // However stylus' file ext is styl, so we slice
      response +=
        `import classes from "./styles.module.${config.addPreprocessor.slice(0, 4)}";\n\n`;
      
      if (config?.useLambdaSimplifier) {
        response += [
          "export const MyComponent = () => (",
          "  <div className={classes.box}>",
          "    <button className={classes.button}>Button</button>",
          "  </div>",
          ")"
        ].join("\n");
      } else {
        response += [
          "export const MyComponent = () => {",
          "  return (",
          "    <div className={classes.box}>",
          "      <button className={classes.button}>Button</button>",
          "    </div>",
          "  );",
          "}"
        ].join("\n");
      }
      break;

    case "styled-components":
      response += 'import { Container, Button } from "./styles.ts";\n\n';

      if (config?.useLambdaSimplifier) {
        response += [
          "export const MyComponent = () => (",
          "  <Container>",
          "    <Button>Button</Button>",
          "  </Container>",
          ")"
        ].join("\n");
      } else {
        response += [
          "export const MyComponent = () => {",
          "  return (",
          "    <Container>",
          "      <Button>Button</Button>",
          "    </Container>",
          "  );",
          "}"
        ].join("\n");
      }
      break;
    
    case "tailwind-css":
      if (config?.useLambdaSimplifier) {
        response += [
          "export const MyComponent = () => (",
          '  <div className="p-4">',
          '    <button className="appearance-none">Button</button>',
          "  </div>",
          ")"
        ].join("\n");
      } else {
        response += [
          "export const MyComponent = () => {",
          "  return (",
          '    <div className="p-4">',
          '      <button className="appearance-none">Button</button>',
          "    </div>",
          "  );",
          "}"
        ].join("\n");
      }
      break;
  }

  // Adding trailing space
  response += config?.trailingSpace ? "\n" : "";

  return response;
}