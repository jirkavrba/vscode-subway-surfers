// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const videos = [
	"7ghSziUQnhs",
	"n_Dv4JMiwK8",
	"xTul-1jdAG8",
	"GTaXbH6iSFA",
	"yOvtMNuU9gg",
	"2xU1OQkQa3Q",
	"ppcOfYprwIw",
	"c0TODv-6G_A",
	"aUOBDL9bsYo",
	"qGa9kWREOnE",
	"vVJuMq1CMNo"
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('subway-surfers.overstimulate', () => {
		const column = { viewColumn: vscode.ViewColumn.Beside, preserverFocus: true };
		const options = { enableScripts: true };

		const panel = vscode.window.createWebviewPanel('subway-surfers.video', "This code boring ah hell", column, options);
		const video = videos.sort(() => Math.random() - 0.5)[0];

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
						<iframe width="300" height="600" src="https://www.youtube.com/embed/${video}?autoplay=1" frameborder="0" 
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" 
							sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation" allowfullscreen>
						</iframe>
					</div>
                </body>
            </html>
        `;
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
