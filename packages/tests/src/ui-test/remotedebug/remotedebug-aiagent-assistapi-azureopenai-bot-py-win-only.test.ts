// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @author Ivan Chen <v-ivanchen@microsoft.com>
 */
import * as path from "path";
import { VSBrowser } from "vscode-extension-tester";
import { Timeout, ValidationContent } from "../../utils/constants";
import {
  RemoteDebugTestContext,
  deployProject,
  provisionProject,
} from "./remotedebugContext";
import {
  execCommandIfExist,
  createNewProject,
  createEnvironmentWithPython,
} from "../../utils/vscodeOperation";
import {
  initPage,
  validateWelcomeAndReplyBot,
} from "../../utils/playwrightOperation";
import { Env, OpenAiKey } from "../../utils/env";
import { it } from "../../utils/it";
import { editDotEnvFile, validateFileExist } from "../../utils/commonUtils";
import { Executor } from "../../utils/executor";
import os from "os";

describe("Remote debug Tests", function () {
  this.timeout(Timeout.testAzureCase);
  let remoteDebugTestContext: RemoteDebugTestContext;
  let testRootFolder: string;
  let appName: string;
  const appNameCopySuffix = "copy";
  let newAppFolderName: string;
  let projectPath: string;

  beforeEach(async function () {
    // ensure workbench is ready
    this.timeout(Timeout.prepareTestCase);
    remoteDebugTestContext = new RemoteDebugTestContext("aiagent");
    testRootFolder = remoteDebugTestContext.testRootFolder;
    appName = remoteDebugTestContext.appName;
    newAppFolderName = appName + appNameCopySuffix;
    projectPath = path.resolve(testRootFolder, newAppFolderName);
    await remoteDebugTestContext.before();
  });

  afterEach(async function () {
    this.timeout(Timeout.finishAzureTestCase);
    await remoteDebugTestContext.after();

    //Close the folder and cleanup local sample project
    await execCommandIfExist("Workspaces: Close Workspace", Timeout.webView);
    console.log(`[Successfully] start to clean up for ${projectPath}`);
    await remoteDebugTestContext.cleanUp(
      appName,
      projectPath,
      false,
      true,
      false
    );
  });

  it(
    "[auto][Python][Azure OpenAI] Remote debug for AI Agent - Build with Assistants API",
    {
      testPlanCaseId: 28957869,
      author: "v-ivanchen@microsoft.com",
    },
    async function () {
      const driver = VSBrowser.instance.driver;
      await createNewProject("aiagentassist", appName, {
        lang: "Python",
        aiType: "Azure OpenAI",
      });
      validateFileExist(projectPath, "src/app.py");
      await createEnvironmentWithPython();
      const envPath = path.resolve(projectPath, "env", ".env.dev.user");
      const isRealKey = OpenAiKey.azureOpenAiKey ? true : false;
      const azureOpenAiKey = OpenAiKey.azureOpenAiKey
        ? OpenAiKey.azureOpenAiKey
        : "fake";
      const azureOpenAiEndpoint = OpenAiKey.azureOpenAiEndpoint
        ? OpenAiKey.azureOpenAiEndpoint
        : "https://test.com";
      const azureOpenAiModelDeploymentName =
        OpenAiKey.azureOpenAiModelDeploymentName
          ? OpenAiKey.azureOpenAiModelDeploymentName
          : "fake";
      editDotEnvFile(envPath, "SECRET_AZURE_OPENAI_API_KEY", azureOpenAiKey);
      editDotEnvFile(envPath, "AZURE_OPENAI_ENDPOINT", azureOpenAiEndpoint);
      editDotEnvFile(
        envPath,
        "AZURE_OPENAI_MODEL_DEPLOYMENT_NAME",
        azureOpenAiModelDeploymentName
      );

      {
        // create azure assistant need to use local env
        const localEnvPath = path.resolve(
          projectPath,
          "env",
          ".env.local.user"
        );
        const azureOpenAiKey = OpenAiKey.azureOpenAiKey
          ? OpenAiKey.azureOpenAiKey
          : "fake";
        const azureOpenAiEndpoint = OpenAiKey.azureOpenAiEndpoint
          ? OpenAiKey.azureOpenAiEndpoint
          : "https://test.com";
        const azureOpenAiModelDeploymentName =
          OpenAiKey.azureOpenAiModelDeploymentName
            ? OpenAiKey.azureOpenAiModelDeploymentName
            : "fake";
        editDotEnvFile(
          localEnvPath,
          "SECRET_AZURE_OPENAI_API_KEY",
          azureOpenAiKey
        );
        editDotEnvFile(
          localEnvPath,
          "AZURE_OPENAI_ENDPOINT",
          azureOpenAiEndpoint
        );
        editDotEnvFile(
          localEnvPath,
          "AZURE_OPENAI_MODEL_DEPLOYMENT_NAME",
          azureOpenAiModelDeploymentName
        );
      }

      if (isRealKey) {
        console.log("Start to create azure assistant id");

        let insertDataCmd = "";
        if (os.type() === "Windows_NT") {
          insertDataCmd = `python src/utils/creator.py --api-key ${azureOpenAiKey}`;
        } else {
          insertDataCmd = `python src/utils/creator.py --api-key '${azureOpenAiKey}'`;
        }
        const { success: insertDataSuccess, stdout: log } =
          await Executor.execute(insertDataCmd, projectPath);
        // get assistant id from log string
        const assistantId = log.match(
          /Created a new assistant with an ID of: (.*)/
        )?.[1];
        if (!insertDataSuccess) {
          throw new Error("Failed to create assistant");
        }
        editDotEnvFile(envPath, "AZURE_OPENAI_ASSISTANT_ID", assistantId ?? "");
      } else {
        editDotEnvFile(envPath, "AZURE_OPENAI_ASSISTANT_ID", "fake");
      }

      await provisionProject(appName, projectPath);
      await deployProject(projectPath, Timeout.botDeploy);
      // [known issue] python remote need deploy twice
      await deployProject(projectPath, Timeout.botDeploy);
      const teamsAppId = await remoteDebugTestContext.getTeamsAppId(
        projectPath
      );

      const page = await initPage(
        remoteDebugTestContext.context!,
        teamsAppId,
        Env.username,
        Env.password
      );
      await driver.sleep(Timeout.longTimeWait);

      try {
        if (isRealKey) {
          await validateWelcomeAndReplyBot(page, {
            hasWelcomeMessage: false,
            hasCommandReplyValidation: true,
            botCommand:
              "I need to solve the equation `3x + 11 = 14`. Can you help me?",
            expectedWelcomeMessage:
              ValidationContent.AiAssistantBotWelcomeInstruction,
            expectedReplyMessage: "x = 1",
            timeout: Timeout.longTimeWait,
          });
        } else {
          await validateWelcomeAndReplyBot(page, {
            hasWelcomeMessage: false,
            hasCommandReplyValidation: true,
            botCommand: "helloWorld",
            expectedWelcomeMessage:
              ValidationContent.AiAssistantBotWelcomeInstruction,
            expectedReplyMessage: ValidationContent.AiBotErrorMessage2,
            timeout: Timeout.longTimeWait,
          });
        }
      } catch (error) {
        // [known issue] python remote need deploy twice
        await deployProject(projectPath, Timeout.botDeploy);
        if (isRealKey) {
          await validateWelcomeAndReplyBot(page, {
            hasWelcomeMessage: false,
            hasCommandReplyValidation: true,
            botCommand:
              "I need to solve the equation `3x + 11 = 14`. Can you help me?",
            expectedWelcomeMessage:
              ValidationContent.AiAssistantBotWelcomeInstruction,
            expectedReplyMessage: "x = 1",
            timeout: Timeout.longTimeWait,
          });
        } else {
          await validateWelcomeAndReplyBot(page, {
            hasWelcomeMessage: false,
            hasCommandReplyValidation: true,
            botCommand: "helloWorld",
            expectedWelcomeMessage:
              ValidationContent.AiAssistantBotWelcomeInstruction,
            expectedReplyMessage: ValidationContent.AiBotErrorMessage2,
            timeout: Timeout.longTimeWait,
          });
        }
      }
    }
  );
});
