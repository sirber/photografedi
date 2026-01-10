import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import {
  createBackendConfig,
  sharedIgnores,
} from "../eslint.config.js";

export default [
  {
    ignores: sharedIgnores,
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  createBackendConfig({
    globals,
    tsconfigRootDir: import.meta.dirname,
  }),
];
