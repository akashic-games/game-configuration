import type { AssetConfiguration, AudioAssetConfigurationBase } from "../AssetConfiguration";
import type { GameConfiguration } from "../GameConfiguration";

interface ExtractAssetPathsParameterObject {
	gameConfiguraiton: GameConfiguration;
	audioExtensionResolver: (asset: AudioAssetConfigurationBase) => string[];
}

// 指定されたゲーム設定された設定から全アセットと全globalScriptsのパスを取得する
export function extractAssetPaths(params: ExtractAssetPathsParameterObject): string[] {
	const { assets, globalScripts } = params.gameConfiguraiton;
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
		return audioExtensionResolver(asset).map(ext => `${asset.path}.${ext}`);
	} else {
		return asset.path;
	}
}
