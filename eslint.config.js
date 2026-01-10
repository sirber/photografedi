export const sharedIgnores = ["eslint.config.js"];

export function createBackendConfig({ globals, tsconfigRootDir }) {
  return {
    files: ["src/**/*.{ts,js}", "drizzle.config.ts"],
    ignores: ["dist/**"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir,
      },
    },
    rules: {
      "no-console": "off",
    },
  };
}

export function createFrontendConfig({
  globals,
  tsconfigRootDir,
  react,
  reactHooks,
}) {
  return {
    files: ["src/**/*.{ts,tsx,js,jsx}", "*.ts", "*.tsx"],
    ignores: ["dist/**"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true,
        tsconfigRootDir,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  };
}
