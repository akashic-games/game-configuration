import type { AssetConfiguration, AudioAssetConfigurationBase } from "../AssetConfiguration";
import type { GameConfiguration } from "../GameConfiguration";

interface ExtractAssetPathsParameterObject {
	gameConfiguration: GameConfiguration;
	audioExtensionResolver: (asset: AudioAssetConfigurationBase) => string[];
}

// 指定されたゲーム設定された設定から全アセットと全globalScriptsのパスを取得する
export function extractAssetPaths(params: ExtractAssetPathsParameterObject): string[] {
	const { assets, globalScripts } = params.gameConfiguration;
	let paths: string[];
	if (Array.isArray(assets)) {
		paths = assets.flatMap(asset => extractPath(asset, params.audioExtensionResolver));
	} else {
		paths = Object.keys(assets).flatMap(key => extractPath(assets[key], params.audioExtensionResolver));
	}
	if (globalScripts) {
		paths = paths.concat(globalScripts);
	}
	return paths;
}

function extractPath(
	asset: AssetConfiguration,
	audioExtensionResolver: (asset: AudioAssetConfigurationBase) => string[]
): string | string[] {
	if (asset.type === "audio") {
		let extensions: string[];
		if (asset.hint?.extensions) {
			extensions = asset.hint.extensions;
		} else {
			extensions = audioExtensionResolver(asset);
		}
		return extensions.map(ext => `${asset.path}.${ext}`);
	} else {
		return asset.path;
	}
}
