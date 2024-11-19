import type { ScriptAssetRuntimeValue } from "@akashic/pdi-types";
import type { ScriptAssetConfigurationBase } from "./AssetConfiguration";

export type BundledAssetConfiguration = BundledScriptAssetConfiguration;

export interface BundledScriptAssetConfiguration extends Omit<ScriptAssetConfigurationBase, "global" | "virtualPath" | "exports"> {
	execute: (env: ScriptAssetRuntimeValue) => any;
}

export interface AssetBundleConfiguration {
	assets: Record<string, BundledAssetConfiguration>;
}
