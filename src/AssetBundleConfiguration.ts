import type { ScriptAssetRuntimeValue } from "@akashic/pdi-types";

export type BundledAssetConfiguration = BundledScriptAssetConfiguration;

export interface BundledScriptAssetConfiguration {
	type: "script";
	path: string;
	execute: (env: ScriptAssetRuntimeValue) => any;
}

export interface AssetBundleConfiguration {
	assets: Record<string, BundledAssetConfiguration>;
}
