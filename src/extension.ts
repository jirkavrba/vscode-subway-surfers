// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

type VideoSource = {
    label: string;
    videos: string[];
    width: number;
};

const internalVideoSources: VideoSource[] = [
    {
        label: "Subway Surfers",
        videos: ["nNGQ7kMhGuQ", "Tqne5J7XdPA", "hs7Z0JUgDeA", "iYgYfHb8gbQ"],
        width: 300,
    },
    {
        label: "Minecraft Parkour",
        videos: ["intRX7BRA90", "n_Dv4JMiwK8", "GTaXbH6iSFA", "t3SpmH9QQew"],
        width: 600,
    },
    {
        label: "Family Guy Clips",
        videos: ["y5a0ljo-ocI", "Zxl28UgHpn0", "mn-Tlb_wfjc", "fytR78K6rHs"],
        width: 600,
    },
    {
        label: "Better Call Saul Clips",
        videos: ["P0Gl0Sd7K3k", "ySs3T3tc_bQ", "XQQI72wQjEA", "gsAeYmTNL80"],
        width: 600
    }
];

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const userVideoSources: VideoSource[] = vscode.workspace.getConfiguration().get('subway-surfers.customSources') || [];
    const videoSources = internalVideoSources.concat(userVideoSources);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("subway-surfers.overstimulate", () => {
        const column = {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: true,
        };

        const options = { enableScripts: true };

        const panel = vscode.window.createWebviewPanel(
            "subway-surfers.video",
            "This code boring ah hell",
            column,
            options
        );

        const items: vscode.QuickPickItem[] = videoSources.map((source) => {
            return {
                label: source.label,
                alwaysShow: true,
            };
        });

        vscode.window.showQuickPick(items, { placeHolder: "Choose your overstimulation method" }).then((selection) => {
            if (!selection) {
                return;
            }

            const { videos, width } = videoSources.find((source) => source.label === selection.label)!;
            shuffleArray(videos);

            // You can use es6-string-html to get code highlighting but it works poorly.
            
            panel.reveal();
            panel.webview.html = /*html*/ `
            <html lang="en"> 
                <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        #video {
                            display: flex;
                            flex-flow: column nowrap;
                            justify-content: center;
                            align-items: center;
                            width: 100%;
                            height: 100%;
                        }
                        
                        button {
                                margin-top: 1em;
                                border: 1px solid black;
                                background-color: black;
                                padding: 1em;
                                border-radius: 20px;
                                color: white;
                                cursor: pointer;
                            }
                    </style>
                    <script>
                    const videos = ${JSON.stringify(videos)};
                    let current = 0;
                    document.addEventListener('DOMContentLoaded', (event) => {
                        const video = document.getElementById("video-player");
                        const source = document.getElementById("video-source");
                        
                        const playNext = () => {
                            current = current < videos.length ? current + 1 : 0;
                            source.src = \`https://yewtu.be/latest_version?id=\${videos[current]}&amp;itag=22#t=60"\`
                            video.load();
                        }
                        
                        video.addEventListener('ended', playNext);
                        source.addEventListener('error', playNext);
                    });
                    </script>
                </head>
                <body>
                    <div id="video">
                        <video id="video-player" autoplay loop muted controls width="${width}">
                            <source id="video-source" src="https://yewtu.be/latest_version?id=${videos[0]}&amp;itag=22#t=60">
                        </video>
                        <button>🔊 Unmute</button>
					          </div>
                    <script>
                        const video = document.querySelector("#video video")
                        const button = document.querySelector("button")

                        button.addEventListener("click", () => {
                            button.innerText = (vid.muted) ? "🔇 Mute" : "🔊 Unmute";
                            video.muted = !video.muted;
                        });
                    </script>
                </body>
            </html>
        `;
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
