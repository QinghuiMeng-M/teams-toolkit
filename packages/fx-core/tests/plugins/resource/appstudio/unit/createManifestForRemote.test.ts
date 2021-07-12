// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "mocha";
import * as chai from "chai";
import { AppStudioPlugin } from "./../../../../../src/plugins/resource/appstudio";
import { TeamsBot } from "./../../../../../src/plugins/resource/bot";
import { AppStudioError } from "./../../../../../src/plugins/resource/appstudio/errors";
import {
  ConfigMap,
  PluginContext,
  TeamsAppManifest,
  ok,
  err,
  LoadedPlugin,
  Plugin,
} from "@microsoft/teamsfx-api";
import * as uuid from "uuid";
import fs from "fs-extra";
import sinon from "sinon";
import { AppStudioResultFactory } from "../../../../../src/plugins/resource/appstudio/results";

describe("Reload Manifest and Check Required Fields", () => {
  let plugin: AppStudioPlugin;
  let ctx: PluginContext;
  let manifest: TeamsAppManifest;
  let BotPlugin: LoadedPlugin;
  let selectedPlugins: LoadedPlugin[];
  const sandbox = sinon.createSandbox();

  beforeEach(async () => {
    plugin = new AppStudioPlugin();
    ctx = {
      root: "./",
      configOfOtherPlugins: new Map(),
      config: new ConfigMap(),
      app: new TeamsAppManifest(),
    };
    ctx.ProjectSettings = {
      appName: "my app",
      currentEnv: "default",
      projectId: uuid.v4(),
      solutionSettings: {
        name: "azure",
        version: "1.0",
      },
    };
    manifest = new TeamsAppManifest();
    const botplugin: Plugin = new TeamsBot();
    BotPlugin = botplugin as LoadedPlugin;
    BotPlugin.name = "fx-resource-bot";
    BotPlugin.displayName = "Bot";
    selectedPlugins = [BotPlugin];
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("maybeSelectedPlugins error", async () => {
    const createManifestForRemoteResult = await plugin.createManifestForRemote(
      ctx,
      err(
        AppStudioResultFactory.SystemError(
          AppStudioError.UnhandledError.name,
          AppStudioError.UnhandledError.message
        )
      ),
      manifest
    );
    chai.assert.isTrue(createManifestForRemoteResult.isErr());
    if (createManifestForRemoteResult.isErr()) {
      chai
        .expect(createManifestForRemoteResult._unsafeUnwrapErr().name)
        .equals(AppStudioError.UnhandledError.name);
    }
  });

  it("Internal error", async () => {
    const createManifestForRemoteResult = await plugin.createManifestForRemote(
      ctx,
      ok(selectedPlugins),
      manifest
    );
    chai.assert.isTrue(createManifestForRemoteResult.isErr());
    if (createManifestForRemoteResult.isErr()) {
      chai
        .expect(createManifestForRemoteResult._unsafeUnwrapErr().name)
        .equals(AppStudioError.UnhandledError.name);
    }
  });
});
