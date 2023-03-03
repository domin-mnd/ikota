import { Command } from "@oclif/core";
import { color } from "@oclif/color";

export default class Component extends Command {
  static description =
    "Generate a component.";

  static examples = [
    "<%= config.bin %> <%= command.id %>",
  ];

  public async run(): Promise<void> {
    this.log(`Generating ${color.cmd("component")}...`);
  }
}
