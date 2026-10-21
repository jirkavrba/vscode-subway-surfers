// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as http from "http";
import * as vscode from "vscode";
import * as template from "./player.template.html";

type VideoSource = {
    label: string;
    description?: string;
    videos?: string[];
    gameUrl?: string;
    width: number;
    muted?: boolean;
};

const internalVideoSources: VideoSource[] = [
    {
        label: "Subway Surfers",
        description: "Classic Subway Surfers gameplay run",
        videos: ["nNGQ7kMhGuQ", "Tqne5J7XdPA", "hs7Z0JUgDeA", "iYgYfHb8gbQ", "JpZ6xY_l394"],
        width: 320,
        muted: true,
    },
    {
        label: "Subway Surfers (Playable Game)",
        description: "Play Subway Surfers directly inside VS Code!",
        gameUrl: "https://hilfig3r.github.io/subway-surfer-monaco",
        width: 360,
        muted: false,
    },
    {
        label: "Minecraft Parkour",
        description: "High FPS relaxing Minecraft parkour",
        videos: ["intRX7BRA90", "n_Dv4JMiwK8", "GTaXbH6iSFA", "t3SpmH9QQew"],
        width: 600,
        muted: true,
    },
    {
        label: "Family Guy Clips",
        description: "Family Guy funniest moments compilation",
        videos: ["y5a0ljo-ocI", "Zxl28UgHpn0", "mn-Tlb_wfjc", "fytR78K6rHs"],
        width: 600,
        muted: true,
    },
    {
        label: "CS:GO / CS2 Surfing",
        description: "Smooth CS:GO surf movement gameplay",
        videos: ["Lixl3-jz7k8", "3GWPJtSGm8c", "I-VQuQu2_lc"],
        width: 600,
        muted: true,
    },
    {
        label: "Satisfying Videos",
        description: "Kinetic sand, soap cutting & odd satisfaction",
        videos: ["zPhjxwTDdLY", "etp46Aca_UM", "wjQq0nSGS28", "mQGT4BzeUUc"],
        width: 600,
        muted: true,
    },
    {
        label: "GTA V Stunts & Mega Ramps",
        description: "GTA 5 crazy stunt races and ramps",
        videos: ["s1vIeH1u1_w", "lK-r_R3Ua1E", "9D2Hsm-p-1w"],
        width: 600,
        muted: true,
    },
];

let localServer: http.Server | null = null;
let serverPort: number = 0;

function ensureServer(): Promise<number> {
    if (localServer && serverPort) {
        return Promise.resolve(serverPort);
    }
    return new Promise((resolve) => {
        localServer = http.createServer((req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

            const reqUrl = new URL(req.url || "/", `http://127.0.0.1:${serverPort}`);
            if (reqUrl.pathname === "/yt-embed") {
                const videoId = reqUrl.searchParams.get("v") || "nNGQ7kMhGuQ";
                const muted = reqUrl.searchParams.get("muted") === "0" ? "0" : "1";
                const autoplay = reqUrl.searchParams.get("autoplay") === "0" ? "0" : "1";

                const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <title>Video</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
        iframe { width: 100%; height: 100%; border: none; display: block; }
    </style>
</head>
<body>
    <iframe
        id="yt-embed"
        src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay}&mute=${muted}&controls=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write; fullscreen"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
    </iframe>
</body>
</html>`;
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.writeHead(200);
                res.end(html);
                return;
            }

            res.setHeader("Content-Type", "text/plain");
            res.writeHead(404);
            res.end("Not found");
        });

        localServer.listen(0, "127.0.0.1", () => {
            const addr = localServer!.address();
            if (addr && typeof addr === "object") {
                serverPort = addr.port;
                resolve(serverPort);
            } else {
                resolve(0);
            }
        });

        localServer.on("error", (err) => {
            console.error("Local server error:", err);
            resolve(0);
        });
    });
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("subway-surfers.overstimulate", async () => {
        const configuration = vscode.workspace.getConfiguration();
        const userVideoSources: VideoSource[] = configuration.get("subway-surfers.customSources") || [];
        const defaultMuted: boolean = configuration.get("subway-surfers.defaultMuted") ?? true;
        const videoSources = internalVideoSources.concat(userVideoSources);

        const items: vscode.QuickPickItem[] = videoSources.map((source) => {
            return {
                label: source.label,
                description: source.description,
                alwaysShow: true,
            };
        });

        const selection = await vscode.window.showQuickPick(items, { placeHolder: "Choose your overstimulation method" });
        if (!selection) {
            return;
        }

        const port = await ensureServer();

        const column = {
            viewColumn: vscode.ViewColumn.Beside,
            preserveFocus: true,
        };

        const options: vscode.WebviewPanelOptions & vscode.WebviewOptions = {
            enableScripts: true,
            retainContextWhenHidden: true,
        };

        const panel = vscode.window.createWebviewPanel(
            "subway-surfers.video",
            "This code boring ah hell",
            column,
            options
        );

        const source = videoSources.find((s) => s.label === selection.label) || videoSources[0];
        const videos = source.videos && source.videos.length > 0
            ? [...source.videos].sort(() => 0.5 - Math.random()) // Shuffle videos array
            : [];
        const muted = source.muted !== undefined ? source.muted : defaultMuted;
        const gameUrl = source.gameUrl || "";

        const html = template
            .replace(/SERVER_PORT/g, port.toString())
            .replace(/WIDTH/g, (source.width || 320).toString())
            .replace(/VIDEOS/g, JSON.stringify(videos))
            .replace(/MUTED/g, JSON.stringify(muted))
            .replace(/GAME_URL/g, JSON.stringify(gameUrl))
            .trim();

        panel.reveal();
        panel.webview.html = html;
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (localServer) {
        localServer.close();
        localServer = null;
        serverPort = 0;
    }
}
