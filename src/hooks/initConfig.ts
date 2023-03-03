import { Hook, ux } from "@oclif/core";
import { access } from "fs";
import inquirer from "inquirer";

export const hook: Hook<"init"> = async (options) => {
  console.log("yes")
  access("./ikota.config.js", async (_) => {
    ux.log("We couldn't find the ikota configuration!");
    let res = await inquirer.prompt([
      {
        name: "ui",
        message: "Select UI type",
        type: "list",
        choices: [{ name: "react" }, { name: "vue" }],
      },
    ]);
    console.log(res.ui);
  });
};
