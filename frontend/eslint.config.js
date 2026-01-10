import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import {
  createFrontendConfig,
  sharedIgnores,
} from "../eslint.config.js";

export default [
  {
    ignores: sharedIgnores,
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  createFrontendConfig({
    globals,
    react,
    reactHooks,
    tsconfigRootDir: import.meta.dirname,
  }),
];
