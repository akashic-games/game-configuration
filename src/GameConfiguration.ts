import type { AssetConfiguration, AssetConfigurationMap, AudioSystemConfigurationMap, ModuleMainScriptsMap } from "./AssetConfiguration";
import type { OperationPluginInfo } from "./OperationPluginInfo";

/**
 * ゲームの設定を表すインターフェース。
 * game.jsonによって定義される。
 */
export interface GameConfiguration {
	/**
	 * ゲーム画面の幅。
	 */
	width: number;

	/**
	 * ゲーム画面の高さ。
	 */
	height: number;

	/**
	 * ゲームのFPS。省略時は30。
	 */
	fps?: number;

	/**
	 * エントリポイント。require() できるパス。
	 */
	main: string;

	/**
	 * AudioSystemの追加定義。キーにsystem名を書く。不要(デフォルトの "sound" と "music" しか使わない)なら省略してよい。
	 */
	audio?: AudioSystemConfigurationMap;

	/**
	 * アセット宣言。
	 */
	assets: AssetConfigurationMap | AssetConfiguration[];

	/**
	 * 操作プラグインの情報。
	 */
	operationPlugins?: OperationPluginInfo[];

	/**
	 * スクリプトアセットの簡略記述用テーブル。
	 *
	 * グローバルアセットである *.js ファイル、*.json ファイルに限り、この配列にファイル名(コンテンツルートディレクトリから相対パス)を書くことができる。
	 * ここにファイル名を書いた場合、 `assets` でのアセット定義は不要であり、拡張子 js であれば `ScriptAsset` として、
	 * 拡張子 json であれば `TextAsset` として扱われる。また常に "global": true として扱われる。
	 * ここに記述されたファイルのアセットIDは不定である。ゲーム開発者がこのファイルを読み込むためには、相対パスによる (`require()` を用いねばならない)
	 */
	globalScripts?: string[];

	/**
	 * require()解決用ののエントリポイントを格納したテーブル。
	 *
	 * require()の第一引数をキーとした値が本テーブルに存在した場合、require()時にその値をパスとしたスクリプトアセットを評価する。
	 */
	moduleMainScripts?: ModuleMainScriptsMap;

	/**
	 * デフォルトローディングシーンについての指定。
	 * 省略時または "default" を指定すると `DefaultLoadingScene` を表示する。
	 * "compact"を指定すると以下のようなローディングシーンを表示する。
	 *   * 背景が透過
	 *   * プログレスバーが画面中央ではなく右下の方に小さく表示される
	 * デフォルトローディングシーンを非表示にしたい場合は "none" を指定する。
	 */
	defaultLoadingScene?: "default" | "compact" | "none";

	/**
	 * デフォルトのスキッピングシーンについての指定。
	 * 省略時または "fast-forward" を指定するとスキップ中のシーン内容をそのまま早送りで表示する。
	 * "indicator"を指定するとスキップ中に専用のシーンを表示する。
	 * スキップ中の描画を抑制したい場合は "none" を指定する。
	 */
	defaultSkippingScene?: "fast-forward" | "indicator" | "none";

	environment?: Environment;
}

export interface NormalizedGameConfiguration extends GameConfiguration {
	fps: number;
	assets: AssetConfigurationMap;
}

export interface GameConfigurationDefinitionDeclaration {
	/**
	 * GameConfigurationの内容を得られるURL。
	 */
	url: string;
	/**
	 * GameConfigurationのpath, globalScriptsのパスの基準となるパス。
	 * 指定されなかった場合、 `g.PathUtil.resolveDirname(this.url)` が与えられたものとみなされる。
	 */
	basePath?: string;
}

export interface CascadeGameConfiguration {
	/**
	 * `GameConfigurationDefinitionDeclaration` の配列。
	 *
	 * 指定された場合、この `GameConfiguration` は、指定された配列で得られた `GameConfiguration` を
	 * すべてマージしたものであるかのように取り扱われる。この時このオブジェクトの他のプロパティは無視される。
	 *
	 * 配列の各要素には文字列を与えることもできる。
	 * `path: string` は `{ url: path }: GameConfigurationDefinitionDeclaration` として解釈される。
	 */
	definitions: (string | GameConfigurationDefinitionDeclaration)[];
}

export interface Environment {
	"sandbox-runtime"?: string;
	"akashic-runtime"?: AkashicRuntime | string;
	atsumaru?: AtsumaruEnvironment;
	nicolive?: NicoliveEnvironment;
	external?: External;
}

export interface AkashicRuntime {
	version: string;
	flavor?: string;
}

export interface AtsumaruEnvironment {
	supportedModes?: AtsumaruSupportedModes[];
}

export interface NicoliveEnvironment {
	supportedModes?: NicoliveSupportedModes[];
}

export type AtsumaruSupportedModes = "multi";
export type NicoliveSupportedModes  = "single" | "ranking" | "multi_admission" | "multi";

export interface External {
	[key: string]: string;
}
