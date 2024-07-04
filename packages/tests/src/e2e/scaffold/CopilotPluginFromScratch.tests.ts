// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @author Yuqi Zhou <yuqzho@microsoft.com>
 */

import { describe } from "mocha";
import { expect } from "chai";
import * as path from "path";
import * as chai from "chai";

import { it } from "@microsoft/extra-shot-mocha";
import * as fs from "fs-extra";
import { CliHelper } from "../../commonlib/cliHelper";
import { Capability } from "../../utils/constants";
import { environmentNameManager } from "@microsoft/teamsfx-core/build/core/environmentName";
import {
  cleanUpLocalProject,
  createResourceGroup,
  getTestFolder,
  getUniqueAppName,
  readContextMultiEnvV3,
  setProvisionParameterValueV3,
  getSubscriptionId,
  execAsyncWithRetry,
} from "../commonUtils";
import { deleteTeamsApp } from "../debug/utility";

describe("Create Copilot plugin", () => {
  const testFolder = getTestFolder();
  const appName = getUniqueAppName();
  const resourceGroupName = `${appName}-rg`;
  const envName = environmentNameManager.getDefaultEnvName();
  const projectPath = path.resolve(testFolder, appName);
  const env = Object.assign({}, process.env);
  const subscription = getSubscriptionId();

  afterEach(async function () {
    // clean up
    const context = await readContextMultiEnvV3(projectPath, "dev");
    if (context?.TEAMS_APP_ID) {
      await deleteTeamsApp(context.TEAMS_APP_ID);
    }

    await cleanUpLocalProject(projectPath);
  });

  it(
    "happy path: scaffold",
    { testPlanCaseId: 27569734, author: "yuqzho@microsoft.com" },
    async function () {
      const env = Object.assign({}, process.env);

      env["API_COPILOT_PLUGIN"] = "true";
      env["DEVELOP_COPILOT_PLUGIN"] = "true";

      // create
      await CliHelper.createProjectWithCapability(
        appName,
        testFolder,
        Capability.CopilotPluginFromScratch,
        env
      );
      console.log(`[Successfully] scaffold to ${projectPath}`);

      // check specified files
      const files: string[] = [
        "appPackage/ai-plugin.json",
        "appPackage/manifest.json",
      ];
      for (const file of files) {
        const filePath = path.join(testFolder, appName, file);
        expect(fs.existsSync(filePath), `${filePath} must exist.`).to.eq(true);
      }

      console.log(`start provision`);
      const result = await createResourceGroup(resourceGroupName, "westus");
      chai.assert.isTrue(result);

      const option = "";
      const processEnv = {
        ...env,
        AZURE_RESOURCE_GROUP_NAME: resourceGroupName,
      };
      const res = await execAsyncWithRetry(
        `teamsapp provision --env dev --interactive false --verbose ${option}`,
        {
          cwd: projectPath,
          env: processEnv,
          timeout: 0,
        }
      );

      if (res.stderr) {
        if (
          res.stderr.includes("Request failed with status code 400") &&
          res.stderr.includes("No elements found in the manifest")
        ) {
          console.warn(`Skipped error: ${res.stderr}`);
        } else {
          console.error(
            `[Failed] provision ${projectPath}. Error message: ${res.stderr}`
          );
        }
      } else {
        console.log(`[Successfully] provision ${projectPath}`);
      }
    }
  );
});
