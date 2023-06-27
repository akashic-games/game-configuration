import type { AssetConfiguration, AssetConfigurationMap } from "../AssetConfiguration";
import { toAssetArray } from "./utils";

/**
 * アセットのマップまたは配列を path をキーとしたマップに変換する。
 * 同じパスを参照する複数のアセット定義が存在する場合、そのうちのいずれか一つしか残らないことに注意。
 * @param assetsOrAssetMap アセットのマップまたは配列
 */
export function makePathKeyObject(assetsOrAssetMap: AssetConfigurationMap | AssetConfiguration[]): AssetConfigurationMap {
	const obj: { [path: string]: AssetConfiguration } = {};
	const assets = !Array.isArray(assetsOrAssetMap) ? toAssetArray(assetsOrAssetMap) : assetsOrAssetMap;
	for (const asset of assets) {
		obj[asset.path] = { ...asset };
	}
	return obj;
}
