// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

type VideoSource = {
    label: string;
    videos: Array<string>;
    width: number;
};

const videoSources: Array<VideoSource> = [
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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("subway-surfers.overstimulate", () => {
        const column = {
            viewColumn: vscode.ViewColumn.Beside,
            preserverFocus: true,
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
            const video = videos[Math.floor(Math.random() * videos.length)];

            panel.reveal();
            // You can use es6-string-html to get code highlighting but it works poorly.
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
                    </style>
                    <script>
                    const videos = ${JSON.stringify(videos)};
                    document.addEventListener('DOMContentLoaded', function (event) {
                        const video = document.getElementById("video-player");
                        const source = document.getElementById("source");
                        const getRandomVideo = () => {
                            return videos[Math.floor(Math.random() * videos.length)];
                        }
                        video.addEventListener('ended', () => {
                            source.src = \`https://yewtu.be/latest_version?id=\${getRandomVideo()}&amp;itag=22#t=60"\`
                            video.load();
                        });
                  });
                  </script>
                </head>
                <body>
                    <div id="video">
                        <video autoplay muted controls width="${width}">
                            <source src="https://yewtu.be/latest_version?id=${video}&amp;itag=22#t=60">
                        </video>
					          </div>
                </body>
            </html>
        `;
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
