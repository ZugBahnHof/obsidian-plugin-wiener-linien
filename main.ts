import {App, Modal, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {VIEW_TYPE_WIENER_LINIEN, WienerLinienView} from './view';

import stationsPerLine from "./data/stations-per-line.json";

type LineID = keyof typeof stationsPerLine;

// Remember to rename these classes and interfaces!

const SETTINGS_INDEX = 0;

interface WienerLinienSettings {
	numTrains: number;
	rblNumbers: string[];
	trains: LineID[];
	showRelatedLines: boolean;
}

const DEFAULT_SETTINGS: WienerLinienSettings = {
	numTrains: 1,
	rblNumbers: ['4437'],
	trains: ['301'],
	showRelatedLines: true,
}

const options = () => Object.fromEntries(
	Object.entries(stationsPerLine).map(([key, value]) => [key, value?.name])
);

let stations: Record<LineID, Record<string, string>>;
let stationOptions: Record<number, Record<string, string>>;

stations = Object.fromEntries(
	(Object.keys(stationsPerLine) as LineID[]).map(
		line => (
			[
				line,
				Object.fromEntries(
					stationsPerLine[line]
						.stations
						.filter(station => station.id && station.name)
						.sort((a, b) =>
							((maybeZero, fallback) => maybeZero === 0 ? fallback : maybeZero)(
								a.direction.localeCompare(b.direction) * 10,
								a.name.localeCompare(b.name),
							)
						)
						.map(station => [station.id, `${station.name}    (Direction ${station.direction})`])
				)
			]
		)
	)
) as Record<LineID, Record<string, string>>;

function refreshStations(trains: LineID[]) {
	stationOptions = Object.fromEntries(
		trains.map((train, index) => [index, stations[train]])
	);
}

export default class WienerLinienPlugin extends Plugin {
	settings?: WienerLinienSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('train', 'Wiener Linien', () => {
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

	async reloadView() {
		const view = this.app.workspace.getActiveViewOfType(WienerLinienView);
		if (view !== null) {
			// There is an active view, so simply create a new one
			return this.openView()
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(reload?: boolean|undefined) {
		await this.saveData(this.settings);
		if (reload === true) {
			await this.reloadView();
		}
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

		refreshStations(this.plugin.settings!.trains)

		new Setting(containerEl)
			.setName('Station number')
			.setDesc('Should be a valid RBL number')
			.addText(text => text
				.setPlaceholder('4437')
				.setValue(this.plugin.settings!.rblNumbers[SETTINGS_INDEX])
				.onChange(async (value) => {
					this.plugin.settings!.rblNumbers[SETTINGS_INDEX] = value;
					await this.plugin.saveSettings(true);
					this.display();
				})
			);

		new Setting(containerEl)
			.setName('Number of stations')
			.setDesc('How many stations should be displayed (1 though 5)? Settings might need to be reloaded to take effect.')
			.addText(text => text
				.setPlaceholder('1')
				.setValue(this.plugin.settings!.numTrains.toString())
				.onChange(async (value) => {
					this.plugin.settings!.numTrains = Math.max(1, Math.min(parseInt(value), 5));
					await this.plugin.saveSettings();
					this.display();
				})
			);


		for (let i = 0; i < this.plugin.settings!.numTrains; i++) {

			new Setting(containerEl)
				.setName(`Line number ${i + 1}`)
				.setDesc("Select your train/tram/bus. Settings might need to be reloaded to take effect.")
				.addDropdown(dropdown => dropdown
					.addOptions(options())
					.setValue(this.plugin.settings!.trains[i])
					.onChange(async (value: string) => {
							this.plugin.settings!.trains[i] = value as LineID;
							await this.plugin.saveSettings();
							refreshStations(this.plugin.settings!.trains);
							this.display();
						}
					)
				)
				.addDropdown(dropdown => dropdown
					.addOptions(stationOptions[i])
					.setValue(this.plugin.settings!.rblNumbers[i])
					.onChange(async (value) => {
						this.plugin.settings!.rblNumbers[i] = value;
						await this.plugin.saveSettings(true);
					})
				);
		}


		new Setting(containerEl)
			.setName('Show related lines')
			.setDesc('Show departures for related lines')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings!.showRelatedLines)
				.onChange(async (value) => {
						this.plugin.settings!.showRelatedLines = value;
						await this.plugin.saveSettings(true);
					}
				));
	}
}
