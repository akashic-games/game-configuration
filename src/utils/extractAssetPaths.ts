import type { AssetConfiguration, AudioAssetConfigurationBase } from "../AssetConfiguration";
import type { GameConfiguration } from "../GameConfiguration";

interface ExtractAssetPathsParameterObject {
	gameConfiguration: GameConfiguration;
	audioExtensionResolver?: (asset: AudioAssetConfigurationBase) => string[];
}

// 指定された GameConfiguration から全アセットと全globalScriptsのパスを取得する
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

// 指定されたアセットのファイルパスを返す。
// 音声アセットの場合のみ複数のファイルが存在するため文字列配列を返している。また、audioExtensionResolver を用いてファイルの拡張子を指定可能。
function extractPath(
	asset: AssetConfiguration,
	audioExtensionResolver?: (asset: AudioAssetConfigurationBase) => string[]
): string | string[] {
	if (asset.type === "audio") {
		let extensions: string[];
		if (audioExtensionResolver) {
			extensions = audioExtensionResolver(asset);
		} else if (asset.hint?.extensions) {
			extensions = asset.hint.extensions;
		} else {
			extensions = ["ogg", "aac"]; // 後方互換性として指定
		}
		return extensions.map(ext => `${asset.path}.${ext}`);
	} else {
		return asset.path;
	}
}
