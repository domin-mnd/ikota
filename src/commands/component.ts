import type { IkotaConfig } from "../types";
import { Command } from "@oclif/core";
import { color } from "@oclif/color";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import typescriptComponent from "../templates/component/ts";
import styledComponents from "../templates/styling/styles";

export default class Component extends Command {
  static description = "Generate a component.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    this.log(`Generating ${color.cmd("component")}...`);

    try {
      require(join(process.cwd(), "./ikota.config.js"));
    } catch (_) {
      return;
    }
    const config: IkotaConfig = require(join(process.cwd(), "./ikota.config.js"));

    const mainFile = typescriptComponent(config);

    let stylesFile;

    // Ignore tailwind css
    if (config.addPreprocessor === "styled-components") {
      stylesFile = styledComponents();
    } else if (config.addPreprocessor !== "tailwind-css") {
      stylesFile = readFileSync(
        join(__dirname, "../templates/styling/styles.module." + config.addPreprocessor?.slice(0, 4))
      );
    }

    mkdirSync(config.componentPath + "/MyComponent", { recursive:true });
    writeFileSync(
      config.componentPath + "/MyComponent/component.tsx",
      mainFile
    );
    writeFileSync(
      config.componentPath +
      "/MyComponent/styles.module." + (
        config.addPreprocessor !== "styled-components" ?
        config.addPreprocessor?.slice(0, 4) :
        "ts"
      ),
      stylesFile as string
    );
  }
}
