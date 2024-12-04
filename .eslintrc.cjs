/**  @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    "react-native/react-native": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-native",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  ignorePatterns: [
    "node_modules",
    ".expo",
    ".expo-shared",
    "assets",
    "*.config.js",
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "react-native/no-raw-text": "off",
    "react-native/no-color-literals": "off",
    "react-native/no-inline-styles": "off",
    "react-native/split-platform-components": "off",
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
