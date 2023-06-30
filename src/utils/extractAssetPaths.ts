import type { AssetConfiguration, AudioAssetConfigurationBase } from "../AssetConfiguration";
import type { GameConfiguration } from "../GameConfiguration";

interface ExtractAssetPathsParameterObject {
	/**
	 * ファイルパスを抜き出したい game.json の内容。
	 */
	gameConfiguration: GameConfiguration;

	/**
	 * オーディオアセットの拡張子を解決する関数。
	 *
	 * 渡されたアセット定義のファイルパスは、これが返した拡張子を加えたものとして扱われる。
	 * 戻り値は "." 込みの拡張子の配列でなければならない。
	 */
	audioExtensionResolver?: (asset: AudioAssetConfigurationBase) => string[];
}

/**
 * 指定された GameConfiguration から全アセットと全globalScriptsのパスを取得する
 */
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
		const exts = audioExtensionResolver?.(asset) ?? asset.hint?.extensions ?? [".ogg", ".aac"];
		return exts.map(ext => `${asset.path}${ext}`);
	} else {
		return asset.path;
	}
}
