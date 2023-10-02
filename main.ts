import {App, Modal, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {VIEW_TYPE_WIENER_LINIEN, WienerLinienView} from './view';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class WienerLinienPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('train', 'Wiener Linien', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			this.openView();
		});

		this.registerView(
			VIEW_TYPE_WIENER_LINIEN,
			leaf => new WienerLinienView(leaf)
		);

		this.addCommand({
			id: 'open-wiener-linien-view',
			name: 'Open Wiener Linien view',
			callback: () => {
				this.openView();
			}
		})

		this.addCommand({
			id: 'refresh-departures',
			name: 'Refresh departures',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const viewOfType = this.app.workspace.getActiveViewOfType(WienerLinienView);
				if (viewOfType) {
					// Only run in WienerLinienView
					if (!checking) {
						// TODO: Implement command
						new Modal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async openView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_WIENER_LINIEN);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE_WIENER_LINIEN,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_WIENER_LINIEN)[0]
		);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: WienerLinienPlugin;

	constructor(app: App, plugin: WienerLinienPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
