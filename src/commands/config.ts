import type { IkotaConfig, IkotaPlugin } from "../types";
import { Command } from "@oclif/core";
import color from "@oclif/color";
import { prompt } from "inquirer";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { capitalCase } from "../utils/capitalCase";

interface PromptPreprocessor {
  name: string;
  value: string;
}

export default class Component extends Command {
  static description = "Initialize the config file.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    this.log(`Processing the configuration of ${color.cmd("ikota.config.js")}`);

    // Initialize plugins if they were provided
    let otherPreprocessors: PromptPreprocessor[] = [];
    // Used in extending & adding preprocessors to the prompt
    const configExists: boolean = existsSync("./ikota.config.js");

    if (configExists) {
      try {
        const config: IkotaConfig = require(join(
          process.cwd(),
          "./ikota.config.js"
        ));

        if (config.plugins && config.preprocessor) {
          for (let i in config.plugins) {
            const pluginWithPreprocessor: IkotaPlugin = config.plugins[i];

            if (pluginWithPreprocessor.components) {
              // Add more preprocessors from the plugin
              otherPreprocessors = [
                ...otherPreprocessors,
                ...Object.keys(pluginWithPreprocessor.components).map(
                  (component): PromptPreprocessor => ({
                    name: capitalCase(component),
                    value: component,
                  })
                ),
              ];
            }
          }
        }
      } catch {
        this.error(
          `Invalid configuration import, consider deleting ${color.red(
            "ikota.config.js"
          )} file, then try again!`
        );
      }
    }

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
        message:
          "Would you want to include index file to export all of the essentials?",
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
          ...otherPreprocessors,
        ],
      },
      {
        name: "useLambdaSimplifier",
        message:
          "Do you want to simplify your component functions with lambda return?",
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

    // If configuration exists, then do not change the template but extend it
    if (configExists) {
      let file: string = readFileSync("./ikota.config.js").toString();

      for (let i in res) {
        // RegEx for checking if there's a line existing
        const valueRegex = new RegExp(i + ":(.*)");
        // A line to be assigned/replaced with
        const line = `${i}: ${
          typeof res[i] === "string" ? `"${res[i]}"` : res[i]
        },`;
        if (valueRegex.test(file)) {
          // Replace module.exports' values without checking if it's inside module.exports
          file = file.replace(valueRegex, line);
        } else {
          // Initial indentation for what goes after module.exports = {\n
          const initialIndentation = Array.from(file.matchAll(/module\.exports(?: *)=(?: *){\n( *)/gm)).map(match => match[1]);
          // Assign a new line
          file = file.replace(
            /module\.exports(?: *)=(?: *){((?:.|\n)*)}/,
            `module.exports = {\n${initialIndentation[0]}${line}$1}`
          );
        }
      }
      writeFileSync("./ikota.config.js", file);

    } else {
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
        `  trailingSpace: ${res.trailingSpace},`,
        `  plugins: []`,
        "}",
      ].join("\n");
      writeFileSync("./ikota.config.js", template);
    }
  }
}
