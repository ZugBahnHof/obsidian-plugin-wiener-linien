import {createWienerLinien} from 'wili';
import {requestUrl} from "obsidian";


const options = {
	relatedLine: ['U2', 'U4', 'U6']
};

// The request method of obsidian does not follow the fetch API exactly
// so we need to wrap it

// @ts-ignore
export const fetchMethod = async input => {
	const response = await requestUrl(input);
	return {
		status: response.status,
		ok: response.status >= 200 && response.status < 300,
		json: async () => response.json,
	};
};


// @ts-ignore
const wili = createWienerLinien(fetchMethod);

export async function getTrafficInfo() {
	// async/await
	try {
		const data = await wili.trafficInfoList(options);
		console.log(data);
	} catch (error) {
		console.error(error);
	}
}

export async function getDepartures(rblNumber: string) {
	// async/await
	try {
		const data = await wili.monitor(rblNumber, {aArea: 1});
		console.log(data);
		return data;
	} catch (error) {
		console.error(error);
		return Promise.reject(error);
	}
}
