// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @author Hui Miao <huimaio@microsoft.com>
 */

import { Capability } from "../../utils/constants";
import { ProgrammingLanguage } from "@microsoft/teamsfx-core";
import { CaseFactory } from "../caseFactory";

class DeclarativeAgentWithPluginNoneAuthTestCase extends CaseFactory {}

const myRecord: Record<string, string> = {};
myRecord["with-plugin"] = "yes";
myRecord["api-plugin-type"] = "new-api";
myRecord["api-auth"] = "none";

new DeclarativeAgentWithPluginNoneAuthTestCase(
  Capability.DeclarativeAgent,
  27971594,
  "huimaio@microsoft.com",
  ["function"],
  ProgrammingLanguage.JS,
  {},
  myRecord
).test();
