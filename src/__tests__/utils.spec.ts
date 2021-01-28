import deepcopy from "deepcopy";
import { CascadeGameConfiguration, GameConfiguration, NormalizedGameConfiguration } from "../GameConfiguration";
import { LoadGameConfigurationFunc, makeLoadConfigurationFunc, _mergeObject } from "../utils";

describe("utils", () => {
	const confs: { [path: string]: GameConfiguration | CascadeGameConfiguration | any } = {
		conf1: {
			width: 320,
			height: 240,
			fps: 30,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				mainScene: { type: "script", path: "script/mainScene.js", global: true },
				chara: { type: "image", path: "image/chara.png", width: 120, height: 120 }
			}
		},
		conf2: {
			fps: 60,
			main: "./CONF2/script/altMain.js",
			assets: {
				altMain: { type: "script", path: "CONF2/script/main.js", global: true }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		},
		conf3: {
			assets: {
				mainScene: { path: "CONF3/script/mainScene.js" },
				chara: { width: 60 }
			},
			globalScripts: ["./node_modules/zoo/index.js"]
		},
		conf4: {
			main: "CONF4/script/mainScene.js",
			assets: [{ path: "CONF4/script/mainScene.js" }, { path: "CONF4/image/chara.png", width: 100, height: 200 }]
		},
		conf5: {
			assets: [{ path: "CONF5/image/chara.png", width: 250, height: 300 }]
		},
		"/base/a/1/conf1": {
			width: 800,
			height: 450,
			fps: 50,
			main: "./script/main.js",
			assets: {
				main: { type: "script", path: "script/main.js", global: true },
				mainScene: { type: "script", path: "script/mainScene.js", global: true },
				chara: { type: "image", path: "image/chara.png", width: 120, height: 120 }
			}
		},
		"/base/a/2/conf2": {
			fps: 120,
			main: "./CONF2/script/altMain.js",
			assets: {
				altMain: { type: "script", path: "CONF2/script/main.js", global: true }
			},
			globalScripts: ["./node_modules/foo/bar.js"]
		},
		"/base/a/3/conf3": {
			assets: {
				mainScene: { path: "CONF3/script/mainScene.js" },
				chara: { width: 180 }
			},
			globalScripts: ["./node_modules/zoo/index.js"]
		},
		"alternative/base/path/conf3": {
			assets: {
				mainScene: { path: "CONF3/script/mainScene.js" },
				chara: { width: 60 }
			},
			globalScripts: ["./node_modules/zoo/index.js"]
		},
		"conf(1+2)": {
			definitions: [
				{ url: "conf1", basePath: "" },
				{ url: "conf2", basePath: "" }
			]
		},
		"conf(1+2+3)": {
			definitions: ["./a/1/conf1", "./a/2/conf2", "./a/3/conf3"]
		},
		"conf((1+2))": {
			definitions: ["conf(1+2)"]
		},
		"conf((1+2)+3)": {
			definitions: ["conf(1+2)", { url: "conf3", basePath: "alternative/base/path/" }]
		},
		"conf(4+5)": {
			definitions: ["conf4", { url: "conf5", basePath: "alternative/base/path/" }]
		},
		fail: {
			definitions: ["throw_error"]
		},
		fail2: {
			width: 320,
			height: 240,
			fps: 30,
			assets: {
				mainScene: { type: "script", path: "./script/../../mainScene.js", global: true }
			}
		}
	};

	const loadGameConfiguration: LoadGameConfigurationFunc = jest.fn((url, callback) => {
		if (url === "throw_error") {
			return void callback(new Error("throw_error"), undefined);
		}
		const conf = deepcopy(confs[url]);
		if (conf) {
			return void callback(null, conf);
		} else {
			return void callback(new Error("couldn't load game configuration"), undefined);
		}
	});

	const loadConfiguration = makeLoadConfigurationFunc(loadGameConfiguration);

	async function promisifiedLoad(
		url: string,
		assetBase: string | undefined,
		cascadeBase: string | undefined
	): Promise<NormalizedGameConfiguration> {
		return new Promise((resolve, reject) => {
			loadConfiguration(url, assetBase, cascadeBase, (err, conf) => (err ? reject(err) : resolve(conf!)));
		});
	}

	describe("makeLoadConfigurationFunc()", () => {
		it("loads g.GameConfiguration", async () => {
			const conf = await promisifiedLoad("conf1", "base", "");
			expect(conf).toEqual({
				width: 320,
				height: 240,
				fps: 30,
				main: "./script/main.js",
				assets: {
					main: {
						type: "script",
						path: "base/script/main.js",
						virtualPath: "script/main.js",
						global: true
					},
					mainScene: {
						type: "script",
						path: "base/script/mainScene.js",
						virtualPath: "script/mainScene.js",
						global: true
					},
					chara: {
						type: "image",
						path: "base/image/chara.png",
						virtualPath: "image/chara.png",
						width: 120,
						height: 120
					}
				}
			});
		});

		it("merges definitions", async () => {
			const conf = await promisifiedLoad("conf(1+2)", "", "");
			expect(conf).toEqual({
				width: 320,
				height: 240,
				fps: 60,
				main: "./CONF2/script/altMain.js",
				assets: {
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
				}
			});
		});

		it("supports nested definitions", async () => {
			const conf = await promisifiedLoad("conf((1+2)+3)", "", "");
			expect(conf).toEqual({
				width: 320,
				height: 240,
				fps: 60,
				main: "./CONF2/script/altMain.js",
				assets: {
					main: {
						type: "script",
						path: "script/main.js",
						virtualPath: "script/main.js",
						global: true
					},
					mainScene: {
						type: "script",
						path: "alternative/base/path/CONF3/script/mainScene.js",
						virtualPath: "CONF3/script/mainScene.js",
						global: true
					},
					chara: {
						type: "image",
						path: "image/chara.png",
						virtualPath: "image/chara.png",
						width: 60,
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
					},
					"./node_modules/zoo/index.js": {
						type: "script",
						virtualPath: "./node_modules/zoo/index.js",
						path: "alternative/base/path/node_modules/zoo/index.js",
						global: true
					}
				}
			});
		});

		it("handles load failure", async done => {
			try {
				await promisifiedLoad("throw_error", "", "");
				done.fail();
			} catch (e) {
				done();
			}
		});

		it("handles nested load failure", async done => {
			try {
				await promisifiedLoad("fail", "", "");
				done.fail();
			} catch (e) {
				done();
			}
		});

		it("catches normalize failure", async done => {
			try {
				await promisifiedLoad("fail2", "", "");
				done.fail();
			} catch (e) {
				done();
			}
		});

		it("supports configuration base url", async () => {
			const conf = await promisifiedLoad("conf(1+2+3)", "./", "/base/");
			expect(conf).toEqual({
				width: 800,
				height: 450,
				fps: 120,
				main: "./CONF2/script/altMain.js",
				assets: {
					main: {
						type: "script",
						path: "/base/a/1/script/main.js",
						virtualPath: "script/main.js",
						global: true
					},
					mainScene: {
						type: "script",
						path: "/base/a/3/CONF3/script/mainScene.js",
						virtualPath: "CONF3/script/mainScene.js",
						global: true
					},
					chara: {
						type: "image",
						path: "/base/a/1/image/chara.png",
						virtualPath: "image/chara.png",
						width: 180,
						height: 120
					},
					altMain: {
						type: "script",
						path: "/base/a/2/CONF2/script/main.js",
						virtualPath: "CONF2/script/main.js",
						global: true
					},
					"./node_modules/foo/bar.js": {
						type: "script",
						path: "/base/a/2/node_modules/foo/bar.js",
						virtualPath: "./node_modules/foo/bar.js",
						global: true
					},
					"./node_modules/zoo/index.js": {
						type: "script",
						path: "/base/a/3/node_modules/zoo/index.js",
						virtualPath: "./node_modules/zoo/index.js",
						global: true
					}
				}
			});
		});
	});

	describe("_mergeObject", () => {
		it("just copies for different type values", () => {
			expect(_mergeObject({ a: true, b: null }, { a: 120, b: "foo", c: true })).toEqual({
				a: 120,
				b: "foo",
				c: true
			});

			expect(_mergeObject({ b: false, d: "foo" }, { a: [1, 2], b: { c: 10 }, c: null })).toEqual({
				a: [1, 2],
				b: { c: 10 },
				c: null,
				d: "foo"
			});
		});

		it("just copies primitive values", () => {
			expect(_mergeObject({ a: 120, b: "foo", c: null, d: true }, { a: 10, b: "bar", d: false })).toEqual({
				a: 10,
				b: "bar",
				c: null,
				d: false
			});
		});

		it("concatenates arrays", () => {
			expect(_mergeObject({ a: [1, 10], b: ["foo", 1], c: [] }, { a: [2, ["tee"]], b: [], c: [true, false] })).toEqual({
				a: [1, 10, 2, ["tee"]],
				b: ["foo", 1],
				c: [true, false]
			});
		});

		it("recursively merges objects", () => {
			expect(
				_mergeObject(
					{
						a: {
							a1: [1, 2],
							a2: false,
							a3: { a31: null },
							a4: [false],
							a5: null
						}
					},
					{
						a: {
							a1: [3],
							a2: true,
							a3: { a32: 1 },
							a4: null,
							a6: { a61: "foo" }
						}
					}
				)
			).toEqual({
				a: {
					a1: [1, 2, 3],
					a2: true,
					a3: {
						a31: null,
						a32: 1
					},
					a4: null,
					a5: null,
					a6: { a61: "foo" }
				}
			});
		});
	});
});
