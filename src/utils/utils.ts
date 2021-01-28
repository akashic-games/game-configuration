import { Promise } from "es6-promise";
import { AssetConfiguration } from "../AssetConfiguration";
import { GameConfiguration, NormalizedGameConfiguration, CascadeGameConfiguration } from "../GameConfiguration";
import { PathUtil } from "./PathUtil";
import { LoadGameConfigurationFunc } from "./types";

export type LoadConfigurationFunc = ReturnType<typeof makeLoadConfigurationFunc>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function makeLoadConfigurationFunc(loadConfiguration: LoadGameConfigurationFunc) {
	function loadResolvedConfiguration(
		url: string,
		assetBase: string | undefined,
		cascadeBase: string | undefined,
		callback: (err: Error | null, conf?: NormalizedGameConfiguration) => void
	): void {
		loadConfiguration(url, (err: any, conf: CascadeGameConfiguration | GameConfiguration) => {
			if (err) {
				return void callback(err);
			}
			if (!("definitions" in conf)) {
				let c: NormalizedGameConfiguration;
				try {
					c = _normalizeAssets(conf, assetBase ?? PathUtil.resolveDirname(url));
				} catch (e) {
					return void callback(e);
				}
				return void callback(null, c);
			}
			const defs = conf.definitions.map(def => {
				if (typeof def === "string") {
					const resolvedUrl = cascadeBase ? PathUtil.resolvePath(cascadeBase, def) : def;
					return promisifiedLoad(resolvedUrl, undefined, cascadeBase);
				} else {
					const resolvedUrl = cascadeBase ? PathUtil.resolvePath(cascadeBase, def.url) : def.url;
					return promisifiedLoad(resolvedUrl, def.basePath, cascadeBase);
				}
			});
			Promise.all(defs)
				.then(confs => callback(null, confs.reduce(_mergeObject)))
				.catch(e => callback(e));
		});
	}
	function promisifiedLoad(
		url: string,
		assetBase: string | undefined,
		cascadeBase: string | undefined
	): Promise<NormalizedGameConfiguration> {
		return new Promise((resolve: (conf: NormalizedGameConfiguration) => void, reject) => {
			loadResolvedConfiguration(url, assetBase, cascadeBase, (err, conf) => (err ? reject(err) : resolve(conf!)));
		});
	}
	return loadResolvedConfiguration;
}

/**
 * 与えられたオブジェクト二つを「マージ」する。
 * ここでマージとは、オブジェクトのフィールドをイテレートし、
 * プリミティブ値であれば上書き、配列であればconcat、オブジェクトであれば再帰的にマージする処理である。
 *
 * @param target マージされるオブジェクト。この値は破壊される
 * @param source マージするオブジェクト
 */
export function _mergeObject(target: any, source: any): any {
	const ks = Object.keys(source);

	for (let i = 0, len = ks.length; i < len; ++i) {
		const k = ks[i];
		const sourceVal = source[k];
		const sourceValType = typeof sourceVal;
		const targetValType = typeof target[k];

		if (sourceValType !== targetValType) {
			target[k] = sourceVal;
			continue;
		}

		if (sourceValType === "string" || sourceValType === "number" || sourceValType === "boolean") {
			target[k] = sourceVal;
		} else if (sourceValType === "object") {
			if (sourceVal == null) {
				target[k] = sourceVal;
			} else if (Array.isArray(sourceVal)) {
				target[k] = target[k].concat(sourceVal);
			} else {
				_mergeObject(target[k], sourceVal);
			}
		} else {
			throw new Error("_mergeObject(): unknown type");
		}
	}
	return target;
}

/**
 * @private
 */
function _normalizeAssets(configuration: GameConfiguration, assetBase: string): NormalizedGameConfiguration {
	const assets: { [assetId: string]: AssetConfiguration } = {};

	function addAsset(assetId: string, asset: AssetConfiguration): void {
		if (assets.hasOwnProperty(assetId)) throw new Error("_normalizeAssets: asset ID already exists: " + assetId);
		assets[assetId] = asset;
	}

	if (Array.isArray(configuration.assets)) {
		configuration.assets.forEach(asset => {
			const path = asset.path;
			if (path) {
				asset.virtualPath = asset.virtualPath ?? asset.path;
				asset.path = PathUtil.resolvePath(assetBase, path);
			}
			addAsset(path, asset);
		});
	} else if (typeof configuration.assets === "object") {
		for (let assetId in configuration.assets) {
			if (!configuration.assets.hasOwnProperty(assetId)) continue;
			const asset = configuration.assets[assetId];
			if (asset.path) {
				asset.virtualPath = asset.virtualPath ?? asset.path;
				asset.path = PathUtil.resolvePath(assetBase, asset.path);
			}
			addAsset(assetId, asset);
		}
	}

	if (configuration.globalScripts) {
		configuration.globalScripts.forEach(path => {
			addAsset(path, {
				type: /\.json$/i.test(path) ? "text" : "script",
				virtualPath: path,
				path: PathUtil.resolvePath(assetBase, path),
				global: true
			});
		});
		delete configuration.globalScripts;
	}

	configuration.assets = assets;

	return configuration as NormalizedGameConfiguration;
}
