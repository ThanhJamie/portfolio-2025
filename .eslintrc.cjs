/* eslint-env node */
const config = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "jsx-a11y", "tailwindcss"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:jsx-a11y/recommended",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "jsx-a11y/no-autofocus": "error",
    "tailwindcss/classnames-order": "error",
    "tailwindcss/no-custom-classname": "off",
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
      config: "tailwind.config.ts",
    },
  },
  overrides: [
    {
      files: ["*.js", "*.mjs", "*.cjs"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
  ],
};

module.exports = config;
