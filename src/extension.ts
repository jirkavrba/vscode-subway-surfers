import * as vscode from "vscode";

type VideoSource = {
    label: string;
    videos: string[];
    width: number;
};

type AudioSource = {
    label: string;
    audios: string[];
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
    },
    {
        label: "Mental Outlaw",
        videos: ["Sk2O6aOEPLM", "Lk_v6Q0YsNo", "3oPeIbpA5x8", "GR_U0G-QGA0"],
        width: 600
    },

];

const internalAudioSources: AudioSource[] = [
    {
        label: "Industrial Society And Its Future",
        audios: ["https://ia600108.us.archive.org/1/items/TheodoreJohnKaczynskiIndustrialSocietyAndItsFuture1995www.MP3Fiber.com/Theodore_John_Kaczynski_Industrial_Society_and_Its_Future_1995%5Bwww.MP3Fiber.com%5D.mp3"],
    },
    {
        label: "Calm",
        audios: ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"],
    },
    {
        label: "Lively",
        audios: ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"],
    },
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const userVideoSources: VideoSource[] = vscode.workspace.getConfiguration().get('subway-surfers.customSources') || [];
    const videoSources = internalVideoSources.concat(userVideoSources);

    const userAudioSources: AudioSource[] = vscode.workspace.getConfiguration().get('subway-surfers.customAudioSources') || [];
    const audioSources = internalAudioSources.concat(userAudioSources);

    let disposable = vscode.commands.registerCommand("subway-surfers.overstimulate", () => {
        const column = {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: true,
        };

        const options = { enableScripts: true };

        const panel = vscode
        const mediaItems: vscode.QuickPickItem[] = videoSources.map((source) => {
            return {
                label: source.label,
                detail: "Video",
                alwaysShow: true,
            };
        }).concat(audioSources.map((source) => {
            return {
                label: source.label,
                detail: "Audio",
                alwaysShow: true,
            };
        }));
    
        vscode.window.showQuickPick(mediaItems, { placeHolder: "Choose your overstimulation method" }).then((selection) => {
            if (!selection) {
                return;
            }
            if (selection.detail === "Video") {
                const selectedSource = videoSources.find((source) => source.label === selection.label);
                if (!selectedSource) {
                    return;
                }
                const { videos, width } = selectedSource;
                const video = videos.sort(() => Math.random() - 0.5)[0];
                const panel = vscode.window.createWebviewPanel(
                    "subwaySurfers", // Identifies the type of the webview
                    "Subway Surfers", // Title of the panel displayed to the user
                    column, // Editor column to show the new webview panel in
                    options // Webview options
                );

                panel.reveal();
                panel.webview.html = `
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
                        </head>
                        <body>
                            <div id="video">
                                <video autoplay controls width="${width}">
                                    <source src="https://yewtu.be/latest_version?id=${video}&amp;itag=22#t=100">
                                </video>
                            </div>
                        </body>
                    </html>
                `;
            } else if (selection.detail === "Audio") {
                const selectedSource = audioSources.find((source) => source.label === selection.label);
                if (!selectedSource) {
                    return;
                }
                const { audios } = selectedSource;
                const audio = audios.sort(() => Math.random() - 0.5)[0];
                const panel = vscode.window.createWebviewPanel(
                    "subwaySurfers", // Identifies the type of the webview
                    "Subway Surfers", // Title of the panel displayed to the user
                    column, // Editor column to show the new webview panel in
                    options // Webview options
                );
                panel.reveal();
                panel.webview.html = `
         <html lang="en"> 
               <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div>
                    <audio controls>
                        <source src="${audio}">
                    </audio>
                </div>
            </body>
        </html>
    `;
            }
        });
    });
    
    context.subscriptions.push(disposable);
}
export function deactivate() {
  }
