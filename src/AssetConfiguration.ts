import type { AudioAssetHint, ImageAssetHint, VectorImageAssetHint, CommonArea } from "@akashic/pdi-types";

/**
 * アセット宣言
 */
export type AssetConfigurationMap = { [key: string]: AssetConfiguration };

/**
 * require()解決用のエントリポイント
 */
export type ModuleMainScriptsMap = { [path: string]: string };

/**
 * require()解決用のエントリポイント
 * 現状、moduleMainScripts と同じ役割となるが、将来的には moduleMainScripts を deprecated としていく。
 */
export type ModuleMainPathsMap = { [path: string]: string };

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
	| VectorImageAssetConfigurationBase
	| BinaryAssetConfigurationBase;

/**
 * Assetの設定の共通部分。
 */
export interface AssetConfigurationCommonBase {
	/**
	 * Assetの種類。
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
	 * 再生時間。単位はミリ秒。
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

	/**
	 * 再生開始位置。単位はミリ秒。
	 */
	offset?: number;
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

	/**
	 * 他のアセットよりも優先して読み込むかどうか。
	 * この値が真であるアセットは、エントリポイントよりも先行して実行される。
	 * global が真ではないアセットを先行して読み込むことはできない。
	 * preload が真のアセットが複数ある場合、それらの実行順序は保証されない点に注意。
	 */
	preload?: boolean;

	/**
	 * このアセットが公開する変数名の配列。指定された場合、 module.exports の一部を上書きする。
	 * 通常は指定する必要のない値であるが、 CommonJS の形式で書かれていないスクリプトを利用するなどの際に用いることができる。
	 * `["foo", "bar"]` を指定した場合、対象のスクリプトアセットの末尾に以下のコードが挿入されたかのように扱われる。
	 * ```
	 * exports["foo"] = foo;
	 * exports["bar"] = bar;
	 * ```
	 */
	exports?: string[];
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

/**
 * BinaryAssetの設定。
 */
export interface BinaryAssetConfigurationBase extends AssetConfigurationBase {
	/**
	 * Assetの種類。
	 */
	type: "binary";
}
