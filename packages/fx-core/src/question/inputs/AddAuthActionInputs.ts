// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/****************************************************************************************
 *                            NOTICE: AUTO-GENERATED                                    *
 ****************************************************************************************
 * This file is automatically generated by script "./src/question/generator.ts".        *
 * Please don't manually change its contents, as any modifications will be overwritten! *
 ***************************************************************************************/

import { Inputs } from "@microsoft/teamsfx-api";

export interface AddAuthActionInputs extends Inputs {
  /** @description Import Manifest File */
  "plugin-manifest-path"?: string;
  /** @description Select an OpenAPI Description Document */
  "openapi-spec-location"?: string;
  /** @description Select an API to Add Auth Configuration */
  "api-operation"?: string[];
  /** @description Enter the Name of Auth Configuration */
  "auth-name"?: string;
  /** @description Authentication Type */
  "api-auth"?: "bearer-token" | "api-key" | "oauth" | "microsoft-entra";
  /** @description Enter the OAuth Authorization URL */
  "oauth-authorization-url"?: string;
  /** @description Enter the OAuth Token URL */
  "oauth-token-url"?: string;
  /** @description Enter the OAuth Refresh URL */
  "oauth-refresh-url"?: string;
  /** @description Enter the OAuth Scope. Samle: scope1: description for scope1; scope2: description for scope2 */
  "oauth-scope"?: string;
  /** @description Enable PKCE for OAuth? */
  "oauth-pkce"?: "true" | "false";
  /** @description Enter where the API Key should be in the request */
  "api-key-in"?: "header" | "query";
  /** @description Enter the Name of API Key */
  "api-key-name"?: string;
}
