import eslintJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  eslintJs.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prettier/prettier": "error",
      "no-unused-vars": "off",
    },
    ignores: ["node_modules/", "dist/", "build/"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  eslintConfigPrettier,
];
