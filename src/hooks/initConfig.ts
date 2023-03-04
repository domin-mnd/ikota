import { Hook, ux } from "@oclif/core";
import { access, writeFileSync } from "fs";
import { prompt } from "inquirer";
import color from "@oclif/color";

export const hook: Hook<"init"> = async (options) => {
  access("./ikota.config.js", async (error) => {
    if (!error) return;
    ux.log("We couldn't find the ikota configuration!");
    ux.log(`Processing the initial configuration of ${color.cmd("ikota.config.js")}`);
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
        name: "addPreprocessor",
        message: "What preprocessor do you use?",
        type: "list",
        choices: [
          { name: "None", value: "css" },
          { name: "Sass", value: "sass" },
          { name: "SCSS", value: "scss" },
          { name: "LESS", value: "less" },
          { name: "Tailwind CSS", value: "tailwind-css" },
          { name: "Stylus", value: "stylus" },
          { name: "Styled components", value: "styled-components" }
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
      `  addPreprocessor: "${res.addPreprocessor}"`,
      "}"
    ].join("\n");
    writeFileSync("./ikota.config.js", template);
  });
};
