import type { IkotaConfig, SupportedPreprocessor } from "../types";
import { Command, Flags, Args } from "@oclif/core";
import { color } from "@oclif/color";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { createComponent } from "../templates/component";
import styledComponents from "../templates/styling/styles";
import { javascriptConfig, typescriptConfig } from "../templates/config";
import { createIndex } from "../templates";

export default class Component extends Command {
  static description = "Generate a component.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    path: Flags.string({
      char: "p",
      description: "Where to place component path",
    }),
    typescript: Flags.boolean({
      char: "t",
      aliases: ["ts"],
      description: "Whether to use typescript or not",
    }),
    addConfig: Flags.boolean({
      char: "c",
      aliases: ["ac"],
      description: "Add config file to the component",
    }),
    addIndex: Flags.boolean({
      char: "i",
      aliases: ["ai"],
      description: "Add index file to the component",
    }),
    preprocessor: Flags.string({
      char: "P",
      aliases: ["pp"],
      description: "Which preprocessor to use",
    }),
    simplify: Flags.boolean({
      char: "s",
      description: "Simplify the component function with lambda",
    }),
    space: Flags.boolean({
      char: "S",
      description: "Simplify the component function with lambda",
      aliases: ["trailing"],
    }),
  };

  static args = {
    name: Args.string({
      required: false,
      description: "Name of the component",
      default: "myComponent",
    }),
  };

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(Component);

    let config: IkotaConfig = {};

    // Ignore errors
    try {
      config = require(join(process.cwd(), "./ikota.config.js"));
    } catch {}

    // Let hook initialize the config
    if (Object.keys(flags).length === 0 && Object.keys(config).length === 0) {
      return this.log(`Cancelled ${color.cmd("component")} generation...`);
    }

    this.log(`Generating ${color.cmd("component")}...`);

    // The priority is: flags -> config file -> default values
    config = {
      componentPath: flags.path ?? config.componentPath ?? "src/components",
      useTypescript: flags.typescript ?? config.useTypescript ?? true,
      addConfigFile: flags.addConfig ?? config.addConfigFile ?? false,
      addIndexFile: flags.addIndex ?? config.addIndexFile ?? false,
      preprocessor:
        (flags.preprocessor as SupportedPreprocessor) ??
        config.preprocessor ??
        "css",
      useLambdaSimplifier: flags.simplify ?? config.useLambdaSimplifier ?? true,
      trailingSpace: flags.space ?? config.trailingSpace ?? true,
    };

    let stylesFile;

    // Ignore tailwind css
    if (config.preprocessor === "styled-components") {
      stylesFile = styledComponents;
    } else if (config.preprocessor !== "tailwind-css") {
      stylesFile = readFileSync(
        join(
          __dirname,
          "../templates/styling/styles.module." +
            config.preprocessor?.slice(0, 4)
        )
      );
    }

    let mainFile: string = createComponent(config, args.name);
    let configFile: string = config.useTypescript
      ? typescriptConfig
      : javascriptConfig;
    let indexFile: string = createIndex(config);

    // Adding trailing space
    if (config.trailingSpace) {
      mainFile += "\n";
      configFile += "\n";
      stylesFile += "\n";
      indexFile += "\n";
    }

    // Path used to log created files
    let path: string = `${config.componentPath || "."}/${args.name}`;

    // Check whether component exists
    if (existsSync(path)) {
      this.error(
        "Such component path already exists, please consider picking another name!"
      );
    }

    // Make the folder for component
    // Normalize path with .
    mkdirSync(path, {
      recursive: true,
    });
    this.log(`Created ${color.cmd(path)} folder`);

    // Create main component file
    path = `${config.componentPath || "."}/${args.name}/component.tsx`;
    writeFileSync(path, mainFile);
    this.log(`Created ${color.cmd(path)} file`);

    // Create styles file only if not tailwind-css
    if (config.preprocessor !== "tailwind-css") {
      path = `${config.componentPath || "."}/${args.name}/styles.${
        config.preprocessor !== "styled-components"
          ? "module." + config.preprocessor?.slice(0, 4)
          : "ts"
      }`;
      writeFileSync(path, stylesFile as string);
      this.log(`Created ${color.cmd(path)} file`);
    }

    // Create config file
    if (config.addConfigFile) {
      path = `${config.componentPath || "."}/${args.name}/config.${
        config.useTypescript ? "ts" : "js"
      }`;
      writeFileSync(
        path,
        configFile
      );
      this.log(`Created ${color.cmd(path)} file`);
    }

    // Create index file
    if (config.addIndexFile) {
      path = `${config.componentPath || "."}/${args.name}/index.${
        config.useTypescript ? "ts" : "js"
      }`;
      writeFileSync(path, indexFile);
      this.log(`Created ${color.cmd(path)} file`);
    }

    this.log(`Have fun <3`);
  }
}
