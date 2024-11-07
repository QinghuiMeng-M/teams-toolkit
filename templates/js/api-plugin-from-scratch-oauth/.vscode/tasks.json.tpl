// This file is automatically generated by Teams Toolkit.
// The teamsfx tasks defined in this file require Teams Toolkit version >= 5.0.0.
// See https://aka.ms/teamsfx-tasks for details on how to customize each task.
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Teams App Locally",
            "dependsOn": [
                "Validate prerequisites",
                "Start local tunnel",
                "Create resources",
                "Build project",
                "Start application"
            ],
            "dependsOrder": "sequence"
        },
        {
            "label": "Validate prerequisites",
            "type": "teamsfx",
            "command": "debug-check-prerequisites",
            "args": {
                "prerequisites": [
                    "nodejs",
                    "m365Account",
                    "portOccupancy"
                ],
                "portOccupancy": [
                    7071,
                    9229
                ]
            }
        },
        {
            // Start the local tunnel service to forward public URL to local port and inspect traffic.
            // See https://aka.ms/teamsfx-tasks/local-tunnel for the detailed args definitions.
            "label": "Start local tunnel",
            "type": "teamsfx",
            "command": "debug-start-local-tunnel",
            "args": {
                "type": "dev-tunnel",
                "ports": [
                    {
                        "portNumber": 7071,
                        "protocol": "http",
                        "access": "public",
                        "writeToEnvironmentFile": {
                            "endpoint": "OPENAPI_SERVER_URL", // output tunnel endpoint as OPENAPI_SERVER_URL
                            "domain": "OPENAPI_SERVER_DOMAIN" // output tunnel domain as OPENAPI_SERVER_DOMAIN
                        }
                    }
                ],
                "env": "local"
            },
            "isBackground": true,
            "problemMatcher": "$teamsfx-local-tunnel-watch"
        },
        {
            "label": "Create resources",
            "type": "teamsfx",
            "command": "provision",
            "args": {
                "env": "local"
            }
        },
        {
            "label": "Build project",
            "type": "teamsfx",
            "command": "deploy",
            "args": {
                "env": "local"
            }
        },
        {
            "label": "Start application",
            "dependsOn": [
                "Start backend"
            ]
        },        
        {
            "label": "Start backend",
            "type": "shell",
            "command": "npm run dev:teamsfx",
            "isBackground": true,
            "options": {
                "cwd": "${workspaceFolder}",
                "env": {
                    "PATH": "${workspaceFolder}/devTools/func:${env:PATH}"
                }
            },
            "windows": {
                "options": {
                    "env": {
                        "PATH": "${workspaceFolder}/devTools/func;${env:PATH}"
                    }
                }
            },
            "problemMatcher": {
                "pattern": {
                    "regexp": "^.*$",
                    "file": 0,
                    "location": 1,
                    "message": 2
                },
                "background": {
                    "activeOnStart": true,
                    "beginsPattern": "^.*(Job host stopped|signaling restart).*$",
                    "endsPattern": "^.*(Worker process started and initialized|Host lock lease acquired by instance ID).*$"
                }
            },
            "presentation": {
                "reveal": "silent"
            }
        {{^DeclarativeCopilot}}
        },
        {
            "label": "Start Teams App in Desktop Client",
            "dependsOn": [
                "Validate prerequisites",
                "Start local tunnel",
                "Create resources",
                "Build project",
                "Start application",
                "Start desktop client"
            ],
            "dependsOrder": "sequence"
        },
        {
            "label": "Start desktop client",
            "type": "teamsfx",
            "command": "launch-desktop-client",
            "args": {
                "url": "teams.microsoft.com"
            }
        }
        {{/DeclarativeCopilot}}
        {{#DeclarativeCopilot}}
        }
        {{/DeclarativeCopilot}}
    ]
}