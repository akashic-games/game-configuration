import type { AssetConfiguration, AssetConfigurationMap } from "../AssetConfiguration";
import { toAssetArray } from "./utils";

/**
 * アセットのマップまたは配列を path をキーとしたマップに変換する
 * @param assetsOrAssetMap アセットのマップまたは配列
 */
export function convertToPathKeyObject(assetsOrAssetMap: AssetConfigurationMap | AssetConfiguration[]): AssetConfigurationMap {
	const obj: { [path: string]: AssetConfiguration } = {};
	const assets = !Array.isArray(assetsOrAssetMap) ? toAssetArray(assetsOrAssetMap) : assetsOrAssetMap;
	for (const asset of assets) {
		obj[asset.path] = { ...asset };
	}
	return obj;
}
