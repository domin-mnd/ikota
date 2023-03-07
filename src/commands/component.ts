import type { IkotaConfig, SupportedNativePreprocessor } from "../types";
import { Command, Flags, Args } from "@oclif/core";
import { color } from "@oclif/color";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

import { createComponent } from "../templates/component";
import { createConfig } from "../templates/config";
import { createIndex } from "../templates/index";
import { createStyles } from "../templates/styles";

import { createComponentFile } from "../parsers/component";
import { createStylesFile } from "../parsers/styles";
import { createConfigFile } from "../parsers/config";
import { createIndexFile } from "../parsers";

export default class Component extends Command {
  static description = "Generate a component.";

  static examples = [
    "<%= config.bin %> <%= command.id %>",
    "<%= config.bin %> <%= command.id %> niceBox --javascript",
  ];
  
  static flags = {
    path: Flags.string({
      char: "p",
      description: "Where to place component path",
    }),
    javascript: Flags.boolean({
      char: "j",
      aliases: ["js"],
      allowNo: true,
      description: "Whether to use typescript or javascript",
    }),
    addConfig: Flags.boolean({
      char: "c",
      aliases: ["ac", "addconfig"],
      allowNo: true,
      description: "Add config file to the component",
    }),
    addIndex: Flags.boolean({
      char: "i",
      aliases: ["ai", "addindex"],
      allowNo: true,
      description: "Add index file to the component",
    }),
    preprocessor: Flags.string({
      char: "P",
      aliases: ["pp"],
      description: "Which preprocessor to use",
    }),
    simplify: Flags.boolean({
      char: "s",
      allowNo: true,
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
      useTypescript: !flags.javascript ?? config.useTypescript ?? true,
      addConfigFile: flags.addConfig ?? config.addConfigFile ?? false,
      addIndexFile: flags.addIndex ?? config.addIndexFile ?? false,
      preprocessor:
        (flags.preprocessor as SupportedNativePreprocessor) ??
        config.preprocessor ??
        "none",
      useLambdaSimplifier: flags.simplify ?? config.useLambdaSimplifier ?? true,
      trailingSpace: flags.space ?? config.trailingSpace ?? true,
      plugins: config.plugins ?? [],
      other: config.other ?? {},
    };

    let mainFile: string = await createComponent(config, args.name);
    let stylesFile: string = await createStyles(config, args.name);
    let configFile: string = await createConfig(config, args.name);
    let indexFile: string = await createIndex(config, args.name);

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

    await createComponentFile(config, args.name, mainFile);
    await createStylesFile(config, args.name, stylesFile);
    if (config.addConfigFile)
      await createConfigFile(config, args.name, configFile);
    if (config.addIndexFile)
      await createIndexFile(config, args.name, indexFile);

    this.log(`Have fun <3`);
  }
}
