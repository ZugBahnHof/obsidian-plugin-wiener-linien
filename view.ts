import {ItemView, WorkspaceLeaf} from "obsidian";
import Main from "components/Main.svelte"

export const VIEW_TYPE_WIENER_LINIEN = "wiener-linien-view";

export class WienerLinienView extends ItemView {
	component: Main | undefined;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
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
				rblNumber: this.app.plugins.plugins["wiener-linien"].settings.rblNumber,
			}
		});
	}

	async onClose() {
		this.component?.$destroy();
	}
}
