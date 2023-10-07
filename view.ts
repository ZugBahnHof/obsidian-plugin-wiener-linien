import {ItemView, WorkspaceLeaf} from "obsidian";
import type {WienerLinienSettings} from "./main";
import Main from "components/Main.svelte"

export const VIEW_TYPE_WIENER_LINIEN = "wiener-linien-view";

export class WienerLinienView extends ItemView {
	component: Main | undefined;
	settings: WienerLinienSettings | undefined;

	constructor(leaf: WorkspaceLeaf, settings?: WienerLinienSettings) {
		super(leaf);
		this.settings = settings;
	}

	getViewType() {
		return VIEW_TYPE_WIENER_LINIEN;
	}

	getDisplayText() {
		return "Wiener Linien";
	}

	getIcon() {
		return "train";
	}

	async onOpen() {
		this.component = new Main({
			target: this.contentEl,
			props: {
				rblNumbers: this.settings!.rblNumbers,
				showRelatedLines: this.settings!.showRelatedLines,
			}
		});
	}

	async onClose() {
		this.component?.$destroy();
	}
}
