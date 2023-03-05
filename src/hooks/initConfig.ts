import { Hook, ux } from "@oclif/core";
import { access, writeFileSync } from "fs";
import { prompt } from "inquirer";
import color from "@oclif/color";

/**
 * Initialization function to create config file, only works if no flags & there's package.json
 * @param {any} options Init options
 * @returns {Promise<void>}
 */
export const hook: Hook<"init"> = async (options): Promise<void> => {
  if (options.id === "config" || options.id === "help" || !options.id) return;

  access("./package.json", (error) => {
    if (error)
      ux.error(
        "Cannot find working directory: try initializing package.json via `npm init -y`"
      );
  });

  // If there are flags then we do not do initialization
  if (
    !options.argv.some((arg) => arg.startsWith("-")) ||
    options.argv.length === 0
  ) {
    access("./ikota.config.js", async (error) => {
      if (!error) return;
      ux.log("Cannot find the ikota configuration.");
      ux.log(
        `Processing the initial configuration of ${color.cmd(
          "ikota.config.js"
        )}`
      );
      let res = await prompt([
        {
          name: "componentPath",
          message: "What's the default components path?",
          default: "src/components",
          type: "input",
        },
        {
          name: "useTypescript",
          message: "Do you use TypeScript?",
          type: "confirm",
          default: true,
        },
        {
          name: "addConfigFile",
          message: "Would you want to include configuration file?",
          type: "confirm",
          default: false,
        },
        {
          name: "preprocessor",
          message: "What preprocessor do you use?",
          type: "list",
          choices: [
            { name: "None", value: "none" },
            { name: "CSS", value: "css" },
            { name: "Sass", value: "sass" },
            { name: "SCSS", value: "scss" },
            { name: "Less", value: "less" },
            { name: "Tailwind CSS", value: "tailwind-css" },
            { name: "Stylus", value: "stylus" },
            { name: "Styled components", value: "styled-components" },
          ],
        },
      ]);
      const template: string = [
        "/**",
        " * @type {import('ikota').IkotaConfig}",
        " */",
        "module.exports = {",
        `  componentPath: "${res.componentPath}",`,
        `  useTypescript: ${res.useTypescript},`,
        `  addConfigFile: ${res.addConfigFile},`,
        `  addIndexFile: false,`,
        `  preprocessor: "${res.preprocessor}",`,
        `  useLambdaSimplifier: true,`,
        `  trailingSpace: true,`,
        "}",
      ].join("\n");
      writeFileSync("./ikota.config.js", template);
    });
  }
};
