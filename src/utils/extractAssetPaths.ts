import type { AssetConfiguration, AudioAssetConfigurationBase } from "../AssetConfiguration";
import type { GameConfiguration } from "../GameConfiguration";

interface ExtractAssetPathsParameterObject {
	gameConfigutation: GameConfiguration;
	audioExtensionResolver: (asset: AudioAssetConfigurationBase) => string[];
}

// 指定されたゲーム設定された設定から全アセットと全globalScriptsのパスを取得する
export function extractAssetPaths(params: ExtractAssetPathsParameterObject): string[] {
	const conf = params.gameConfigutation;
	let paths: string[] = [];
	if (Array.isArray(conf.assets)) {
		paths = paths.concat(conf.assets.flatMap(asset => extractPath(asset, params.audioExtensionResolver)));
	} else {
		const assets = conf.assets;
		paths = paths.concat(Object.keys(assets).flatMap(key => extractPath(assets[key], params.audioExtensionResolver)));
	}
	if (conf.globalScripts) {
		paths = paths.concat(conf.globalScripts);
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
