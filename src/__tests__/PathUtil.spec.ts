import { _mergeObject } from "../utils";

describe("PathUtil", () => {
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
