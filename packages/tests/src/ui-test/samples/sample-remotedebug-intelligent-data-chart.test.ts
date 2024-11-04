// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @author Ivan Chen <v-ivanchen@microsoft.com>
 */

import { TemplateProject, LocalDebugTaskLabel } from "../../utils/constants";
import { CaseFactory } from "./sampleCaseFactory";
import { OpenAiKey } from "../../utils/env";
import { AzSqlHelper } from "../../utils/azureCliHelper";
import { SampledebugContext } from "./sampledebugContext";
import { expect } from "chai";
import { editDotEnvFile } from "../../utils/commonUtils";
import path from "path";

class BotSSOTestCase extends CaseFactory {
  public override async onBefore(
    sampledebugContext: SampledebugContext,
    env: "local" | "dev",
    azSqlHelper?: AzSqlHelper | undefined
  ): Promise<AzSqlHelper | undefined> {
    // create sql db server
    const rgName = `${sampledebugContext.appName}-dev-rg`;
    // TODO: add sql command if verify
    const sqlCommands = [""];
    azSqlHelper = new AzSqlHelper(rgName, sqlCommands);
    return azSqlHelper;
  }
  override async onAfter(
    sampledebugContext: SampledebugContext
  ): Promise<void> {
    await sampledebugContext.sampleAfter(
      `${sampledebugContext.appName}-dev-rg}`
    );
  }
  public override async onAfterCreate(
    sampledebugContext: SampledebugContext,
    env: "local" | "dev",
    azSqlHelper?: AzSqlHelper | undefined
  ): Promise<void> {
    const res = await azSqlHelper?.createSql();
    expect(res).to.be.true;
    const envFilePath = path.resolve(
      sampledebugContext.projectPath,
      "env",
      ".env.dev.user"
    );
    editDotEnvFile(envFilePath, "SQL_USER", azSqlHelper?.sqlAdmin ?? "");
    editDotEnvFile(
      envFilePath,
      "SECRET_SQL_PASSWORD",
      azSqlHelper?.sqlPassword ?? ""
    );
    editDotEnvFile(envFilePath, "SQL_SERVER", azSqlHelper?.sqlEndpoint ?? "");
    editDotEnvFile(
      envFilePath,
      "SQL_DATABASE",
      azSqlHelper?.sqlDatabaseName ?? ""
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

    editDotEnvFile(envFilePath, "SECRET_OPENAI_API_KEY", azureOpenAiKey);
    editDotEnvFile(envFilePath, "SECRET_OPENAI_ENDPOINT", azureOpenAiEndpoint);
    editDotEnvFile(
      envFilePath,
      "SECRET_OPENAI_DEPLOYMENT_NAME",
      azureOpenAiModelDeploymentName
    );
  }
}

new BotSSOTestCase(
  TemplateProject.IntelligentDataChart,
  27852477,
  "v-ivanchen@microsoft.com",
  "dev"
).test();
