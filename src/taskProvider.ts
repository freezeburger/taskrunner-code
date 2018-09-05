import * as vscode from 'vscode';
import * as json from 'jsonc-parser';
import * as path from 'path';
import { isNumber } from 'util';

export class TaskTreeDataProvider implements vscode.TreeDataProvider<TreeTask> {

	private _onDidChangeTreeData: vscode.EventEmitter<TreeTask | null> = new vscode.EventEmitter<TreeTask | null>();
	readonly onDidChangeTreeData: vscode.Event<TreeTask | null> = this._onDidChangeTreeData.event;

	private autoRefresh: boolean = true;

	constructor(private context: vscode.ExtensionContext) {

		this.autoRefresh = vscode.workspace.getConfiguration('taskOutline').get('autorefresh');
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	public async getChildren(task?: TreeTask): Promise<TreeTask[]> {
		

		let tasks = await vscode.tasks.fetchTasks().then(function (value) {
			return value;
		});

		let taskNames: TreeTask[] = [];

		if (tasks.length != 0) {
			for (var i = 0; i < tasks.length; i++ ) {
				taskNames[i] = new TreeTask(tasks[i].definition.type, tasks[i].name, vscode.TreeItemCollapsibleState.None, 
					new vscode.Task(tasks[i].definition, tasks[i].scope, tasks[i].source, tasks[i].definition.type)); 
			}
		}
		return taskNames;
	
	}

	getTreeItem(task: TreeTask): vscode.TreeItem {
		return task;
	}
}

class TreeTask extends vscode.TreeItem {
	constructor(
		type: string, 
		label: string, 
		collapsibleState: vscode.TreeItemCollapsibleState,
		task: vscode.Task
	) {
		super(label, collapsibleState);
	}
	 
}

