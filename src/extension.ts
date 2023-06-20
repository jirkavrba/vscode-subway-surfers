// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as template from "./player.template.html";

type VideoSource = {
    label: string;
    videos: string[];
    width: number;
    muted?: boolean;
};

const internalVideoSources: VideoSource[] = [
    {
        label: "Subway Surfers",
        videos: ["nNGQ7kMhGuQ", "Tqne5J7XdPA", "hs7Z0JUgDeA", "iYgYfHb8gbQ"],
        width: 300,
        muted: true,
    },
    {
        label: "Minecraft Parkour",
        videos: ["intRX7BRA90", "n_Dv4JMiwK8", "GTaXbH6iSFA", "t3SpmH9QQew"],
        width: 600,
        muted: true
    },
    {
        label: "Family Guy Clips",
        videos: ["y5a0ljo-ocI", "Zxl28UgHpn0", "mn-Tlb_wfjc", "fytR78K6rHs"],
        width: 600,
    },
    // {
    //     label: "Better Call Saul Clips",
    //     videos: ["P0Gl0Sd7K3k", "ySs3T3tc_bQ", "XQQI72wQjEA", "gsAeYmTNL80"],
    //     width: 600,
    // },
    // {
    //     label: "Mental Outlaw",
    //     videos: ["Sk2O6aOEPLM", "Lk_v6Q0YsNo", "3oPeIbpA5x8", "GR_U0G-QGA0"],
    //     width: 600,
    // },
    {
        label: "CS:GO Surfing",
        videos : ["Lixl3-jz7k8", "3GWPJtSGm8c", "I-VQuQu2_lc"],
        width: 600,
        muted: true
    },
    {
        label: "Satisfying Videos",
        videos: ["zPhjxwTDdLY", "etp46Aca_UM", "wjQq0nSGS28", "mQGT4BzeUUc"],
        width: 600,
        muted: true
    },
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const userVideoSources: VideoSource[] = vscode.workspace.getConfiguration().get("subway-surfers.customSources") || [];
    const videoSources = internalVideoSources.concat(userVideoSources);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("subway-surfers.overstimulate", () => {
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

            const source = videoSources.find((source) => source.label === selection.label)!;
            const html = template
                .replace(/WIDTH/g, source.width.toString())
                .replace(/VIDEOS/g, JSON.stringify(source.videos.sort(() => 0.5 - Math.random()))) // Shuffle the videos array
                .replace(/MUTED/g, source.muted ? "muted" : "") 
                .trim();

            panel.reveal();
            panel.webview.html = html;
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
