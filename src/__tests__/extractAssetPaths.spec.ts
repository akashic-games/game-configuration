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

		const result = extractAssetPaths({ gameConfiguration });
		expect(result).toEqual(["script/main.js", "script/mainScene.js", "image/chara.png", "./node_modules/foo/bar.js"]);
	});

	it("指定されたGameConfigurationに音声アセットが登録されている場合、指定された audioExtensionResolver に従って音声ファイルパスが取得できる", () => {
		const gameConfiguration: GameConfiguration = {
			width: 320,
			height: 240,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				se: { type: "audio", path: "audio/se", duration: 1000, systemId: "sound" }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		};

		const audioExtensionResolver = (_asset: AudioAssetConfigurationBase): string[] => [".m4a", ".ogg", ".aac"];
		const result = extractAssetPaths({ gameConfiguration, audioExtensionResolver });
		expect(result).toEqual(["script/main.js", "audio/se.m4a", "audio/se.ogg", "audio/se.aac", "./node_modules/foo/bar.js"]);
	});

	it("audioExtensionResolver が指定されない場合、hint.extensionsに従って音声ファイルパスが取得できる", () => {
		const gameConfiguration: GameConfiguration = {
			width: 320,
			height: 240,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				se: { type: "audio", path: "audio/se", duration: 1000, systemId: "sound", hint: { extensions: [".m4a", ".aac"] } }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		};

		const result = extractAssetPaths({ gameConfiguration });
		expect(result).toEqual(["script/main.js", "audio/se.m4a", "audio/se.aac", "./node_modules/foo/bar.js"]);
	});

	it("audioExtensionResolver が指定されず音声アセット情報にhint.extensionsが無い場合、oggとaacの音声ファイルパスが取得できる", () => {
		const gameConfiguration: GameConfiguration = {
			width: 320,
			height: 240,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				se: { type: "audio", path: "audio/se", duration: 1000, systemId: "sound" }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		};

		const result = extractAssetPaths({ gameConfiguration });
		expect(result).toEqual(["script/main.js", "audio/se.ogg", "audio/se.aac", "./node_modules/foo/bar.js"]);
	});
});
