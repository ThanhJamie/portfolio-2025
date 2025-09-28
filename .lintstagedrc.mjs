export default {
  "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{js,jsx,cjs,mjs,json,md,css,scss,mdx}": ["prettier --write"],
};
