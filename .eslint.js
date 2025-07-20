export default [
  {
    ignores: ["dist/", "node_modules/"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      ... (await import('eslint/conf/eslint-recommended')).rules,
      ... (await import('@typescript-eslint/eslint-plugin')).configs['recommended'].rules,
    },
  },
];
