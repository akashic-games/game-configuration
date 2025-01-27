const eslintConfig = require("@akashic/eslint-config");

module.exports = [
    ...eslintConfig,
    {
        files: ["**/*.ts"],
        languageOptions: {
            sourceType: "module",
            parserOptions: {
                project: "tsconfig.jest.json",
            },
        },
        rules: {
          "import/order": [
            "error",
            {
              "alphabetize": {
                "order": "asc",
                "caseInsensitive": true
              }
            }
          ]
        },
        ignores: ["**/*.js"]
    }
];
