import type { AudioAssetConfigurationBase } from "../AssetConfiguration";
import type { GameConfiguration } from "../GameConfiguration";
import { extractAssetPaths } from "../utils/extractAssetPaths";

describe("extractAssetPaths", () => {
	it("指定されたGameConfigurationに登録されている全アセットのパスとglobalScriptsのパスを取得できる", () => {
		const gameConfiguration: GameConfiguration = {
			width: 320,
			height: 240,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				mainScene: { type: "script", path: "script/mainScene.js", global: true },
				chara: { type: "image", path: "image/chara.png", width: 120, height: 120 }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		};
		const audioExtensionResolver = (_asset: AudioAssetConfigurationBase): string[] => [];
		const result = extractAssetPaths({ gameConfiguration, audioExtensionResolver });
		expect(result).toEqual(["script/main.js", "script/mainScene.js", "image/chara.png", "./node_modules/foo/bar.js"]);
	});
	it("指定されたGameConfigurationに音声アセットが登録されている場合、指定された関数に従って音声ファイルパスが取得できる", () => {
		const gameConfiguration: GameConfiguration = {
			width: 320,
			height: 240,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				se1: { type: "audio", path: "audio/se1", duration: 1000, systemId: "sound" },
				// hint.extensionsが指定されている場合は、関数ではなくこちらの値が優先される
				se2: { type: "audio", path: "audio/se2", duration: 1000, systemId: "sound", hint: { extensions: ["m4a", "aac"] } }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		};
		const audioExtensionResolver = (_asset: AudioAssetConfigurationBase): string[] => ["ogg", "aac"];
		const result = extractAssetPaths({ gameConfiguration, audioExtensionResolver });
		expect(result).toEqual([
			"script/main.js",
			"audio/se1.ogg",
			"audio/se1.aac",
			"audio/se2.m4a",
			"audio/se2.aac",
			"./node_modules/foo/bar.js"
		]);
	});
});
