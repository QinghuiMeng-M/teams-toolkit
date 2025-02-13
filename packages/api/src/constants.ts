// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

export const ConfigFolderName = "fx";
export const AppPackageFolderName = "appPackage";
export const BuildFolderName = "build";
export const ResponseTemplatesFolderName = "responseTemplates";
export const TemplateFolderName = "templates";
export const ProductName = "teamsfx";
export const AutoGeneratedReadme = "README-auto-generated.md";
export const DefaultReadme = "README.md";
export const SettingsFolderName = "teamsfx";
export const ManifestTemplateFileName = "manifest.json";
export const DefaultApiSpecFolderName = "apiSpecificationFile";
export const DefaultApiSpecYamlFileName = "openapi.yaml";
export const DefaultApiSpecJsonFileName = "openapi.json";
export const DefaultPluginManifestFileName = "ai-plugin.json";

/**
 * questions for VS and CLI_HELP platforms are static question which don't depend on project context
 * questions for VSCode and CLI platforms are dynamic question which depend on project context
 */
export enum Platform {
  VSCode = "vsc",
  CLI = "cli",
  VS = "vs",
  CLI_HELP = "cli_help",
}

export const StaticPlatforms = [Platform.CLI_HELP];
export const DynamicPlatforms = [Platform.VSCode, Platform.CLI, Platform.VS];
export const CLIPlatforms = [Platform.CLI, Platform.CLI_HELP];

export enum VsCodeEnv {
  local = "local",
  codespaceBrowser = "codespaceBrowser",
  codespaceVsCode = "codespaceVsCode",
  remote = "remote",
}

export enum Stage {
  create = "create",
  createTdp = "createTdp",
  build = "build",
  debug = "debug",
  provision = "provision",
  deploy = "deploy",
  package = "package",
  publish = "publish",
  createEnv = "createEnv",
  listEnv = "listEnv",
  removeEnv = "removeEnv",
  switchEnv = "switchEnv",
  userTask = "userTask",
  update = "update", //never used again except APIM just for reference
  grantPermission = "grantPermission",
  checkPermission = "checkPermission",
  listCollaborator = "listCollaborator",
  getQuestions = "getQuestions",
  getProjectConfig = "getProjectConfig",
  addFeature = "addFeature",
  addWebpart = "addWebpart",
  addResource = "addResource",
  addCapability = "addCapability",
  addCiCdFlow = "addCiCdFlow",
  deployAad = "deployAad",
  buildAad = "buildAad",
  ConvertAadToNewSchema = "convertAadToNewSchema",
  deployTeams = "deployTeams",
  initDebug = "initDebug",
  initInfra = "initInfra",
  publishInDeveloperPortal = "publishInDeveloperPortal",
  validateApplication = "validateApplication",
  createAppPackage = "createAppPackage",
  previewWithManifest = "previewWithManifest",
  copilotPluginAddAPI = "copilotPluginAddAPI",
  syncManifest = "syncManifest",
  addPlugin = "addPlugin",
  kiotaRegenerate = "kiotaRegenerate",
  addAuthAction = "addAuthAction",
  addKnowledge = "addKnowledge",
}

export enum TelemetryEvent {
  askQuestion = "askQuestion",
}

export enum TelemetryProperty {
  answerType = "answerType",
  question = "question",
  answer = "answer",
  platform = "platform",
  stage = "stage",
}

/**
 * You can register your callback function when you want to be notified
 * at some predefined events.
 */
export enum CoreCallbackEvent {
  lock = "lock",
  unlock = "unlock",
}
