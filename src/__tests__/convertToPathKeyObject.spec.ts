import { convertToPathKeyObject } from "../utils/convertToPathKeyObject";

describe("convertToPathKeyObject", () => {
	it("can convert an array of assets", () => {
		expect(
			convertToPathKeyObject({
				main: {
					type: "script",
					path: "script/main.js",
					virtualPath: "script/main.js",
					global: true
				},
				mainScene: {
					type: "script",
					path: "script/mainScene.js",
					virtualPath: "script/mainScene.js",
					global: true
				},
				chara: {
					type: "image",
					path: "image/chara.png",
					virtualPath: "image/chara.png",
					width: 120,
					height: 120
				},
				altMain: {
					type: "script",
					path: "CONF2/script/main.js",
					virtualPath: "CONF2/script/main.js",
					global: true
				},
				"./node_modules/foo/bar.js": {
					type: "script",
					path: "./node_modules/foo/bar.js",
					virtualPath: "./node_modules/foo/bar.js",
					global: true
				}
			})
		).toEqual({
			"script/main.js": {
				id: "main",
				type: "script",
				path: "script/main.js",
				virtualPath: "script/main.js",
				global: true
			},
			"script/mainScene.js": {
				id: "mainScene",
				type: "script",
				path: "script/mainScene.js",
				virtualPath: "script/mainScene.js",
				global: true
			},
			"image/chara.png": {
				id: "chara",
				type: "image",
				path: "image/chara.png",
				virtualPath: "image/chara.png",
				width: 120,
				height: 120
			},
			"CONF2/script/main.js": {
				id: "altMain",
				type: "script",
				path: "CONF2/script/main.js",
				virtualPath: "CONF2/script/main.js",
				global: true
			},
			"./node_modules/foo/bar.js": {
				id: "./node_modules/foo/bar.js",
				type: "script",
				path: "./node_modules/foo/bar.js",
				virtualPath: "./node_modules/foo/bar.js",
				global: true
			}
		});
	});
});
