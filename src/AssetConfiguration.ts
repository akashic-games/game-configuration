import { AudioAssetHint, ImageAssetHint, VectorImageAssetHint, CommonArea } from "@akashic/pdi-types";

/**
 * アセット宣言
 */
export type AssetConfigurationMap = { [key: string]: AssetConfiguration };

/**
 * require()解決用のエントリポイント
 */
export type ModuleMainScriptsMap = { [path: string]: string };

/**
 * AudioSystemの設定を表すインターフェース。
 */
export interface AudioSystemConfiguration {
	loop?: boolean;
	hint?: AudioAssetHint;
}

/**
 * オーディオシステム宣言
 */
export type AudioSystemConfigurationMap = {
	[key: string]: AudioSystemConfiguration;
};

export type AssetConfiguration =
	| AudioAssetConfigurationBase
	| ImageAssetConfigurationBase
	| TextAssetConfigurationBase
	| ScriptAssetConfigurationBase
	| VideoAssetConfigurationBase
	| VectorImageAssetConfigurationBase;

/**
 * Assetの設定の共通部分。
 */
export interface AssetConfigurationCommonBase {
	/**
	 * Assetの種類。"image", "audio", "script", "text", "video" のいずれか。
	 */
	type: string;
}

/**
 * Assetの設定を表すインターフェース。
 * game.json の "assets" の各プロパティに記述される値の型。
 */
export interface AssetConfigurationBase extends AssetConfigurationCommonBase {
	/**
	 * Assetを表すファイルへの絶対パス。
	 */
	path: string;

	/**
	 * Assetを表すファイルのrequire解決用の仮想ツリーにおけるパス。
	 * 省略するとエンジンにより自動的に設定される。
	 */
	// エンジン開発者は `Game` オブジェクト作成前に、省略された `virtualPath` を補完する必要がある。
	virtualPath?: string;

	/**
	 * グローバルアセットか否か。省略された場合、偽。
	 * この値が真であるアセットは、ゲームコンテンツから常に `Game#assets` 経由で参照できる。`Scene` のコンストラクタで利用を宣言する必要がない。
	 */
	global?: boolean;
}

/**
 * CommonAreaの短縮表記。
 * 各要素は順に CommonArea の x, y, width, height に読み替えられる。
 */
export type CommonAreaShortened = [number, number, number, number];

/**
 * ImageAssetの設定。
 */
export interface ImageAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "image";

	/**
	 * 幅。
	 */
	width: number;

	/**
	 * 高さ。
	 */
	height: number;

	/**
	 * ヒント。akashic-engineが最適なパフォーマンスを発揮するための情報。
	 */
	hint?: ImageAssetHint;

	/**
	 * 切り出す領域。
	 * 指定した場合、その部分だけの画像アセットとして扱う。
	 */
	slice?: CommonArea | CommonAreaShortened;
}

/**
 * VideoAssetの設定。
 */
export interface VideoAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "video";

	/**
	 * 幅。
	 */
	width: number;

	/**
	 * 高さ。
	 */
	height: number;

	/**
	 * ループ。
	 */
	loop?: boolean;

	/**
	 * width,heightではなく実サイズを用いる指定。
	 */
	useRealSize?: boolean;
}

/**
 * AudioAssetの設定。
 */
export interface AudioAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "audio";

	/**
	 * AudioAssetのsystem指定。
	 */
	systemId: "music" | "sound";

	/**
	 * 再生時間。
	 */
	duration: number;

	/**
	 * ループ。
	 */
	loop?: boolean;

	/**
	 * ヒント。
	 */
	hint?: AudioAssetHint;
}

/**
 * TextAssetの設定。
 */
export interface TextAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "text";
}

/**
 * ScriptAssetの設定。
 */
export interface ScriptAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "script";
}

/**
 * VectorImageAssetの設定。
 */
export interface VectorImageAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "vector-image";

	/**
	 * 幅。
	 */
	width: number;

	/**
	 * 高さ。
	 */
	height: number;

	/**
	 * ヒント。
	 */
	hint?: VectorImageAssetHint;
}
