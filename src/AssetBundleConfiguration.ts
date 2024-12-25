import type { ScriptAssetRuntimeValue } from "@akashic/pdi-types";
import type { ScriptAssetConfigurationBase, TextAssetConfigurationBase } from "./AssetConfiguration";

export type BundledAssetConfiguration = BundledScriptAssetConfiguration | BundledTextAssetConfiguration;

export interface BundledScriptAssetConfiguration extends Omit<ScriptAssetConfigurationBase, "global" | "virtualPath" | "exports"> {
	execute: (env: ScriptAssetRuntimeValue) => any;
}

export interface BundledTextAssetConfiguration extends Omit<TextAssetConfigurationBase, "global" | "virtualPath"> {
	data: string;
}

export interface AssetBundleConfiguration {
	assets: Record<string, BundledAssetConfiguration>;
}
