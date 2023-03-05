import { Command } from "@oclif/core";
import { prompt } from "inquirer";
import { writeFileSync } from "fs";
import color from "@oclif/color";

export default class Component extends Command {
  static description = "Initialize the config file.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    this.log(
      `Processing the configuration of ${color.cmd(
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
        name: "addIndexFile",
        message: "Would you want to include index file to export all of the essentials?",
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
      {
        name: "useLambdaSimplifier",
        message: "Do you want to simplify your component functions with lambda return?",
        type: "confirm",
        default: false,
      },
      {
        name: "trailingSpace",
        message: "Add trailing whitespace at the end of the file?",
        type: "confirm",
        default: false,
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
      `  addIndexFile: ${res.addIndexFile},`,
      `  preprocessor: "${res.preprocessor}",`,
      `  useLambdaSimplifier: ${res.useLambdaSimplifier},`,
      `  trailingSpace: ${res.trailingSpace}`,
      "}",
    ].join("\n");
    writeFileSync("./ikota.config.js", template);
  }
}
