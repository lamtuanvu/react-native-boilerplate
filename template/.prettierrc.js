module.exports = {
  importOrder: [
    '<TYPES>^(node:)',
    '<TYPES>',
    '<TYPES>^@/(.*)$',
    '', // empty line
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '', // empty line
    '^@/theme(.*)$',
    '^@/hooks(.*)$',
    '^@/navigation(.*)$',
    '^@/translations(.*)$',
    '', // empty line
    '^@/components/atoms(.*)$',
    '^@/components/molecules(.*)$',
    '^@/components/organisms(.*)$',
    '^@/components/templates(.*)$',
    '^@/screens(.*)$',
    '', // empty line
    '^@/(.*)$',
    '', // empty line
    '^[.]', // relative imports
  ],
  importOrderTypeScriptVersion: '5.0.0',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  printWidth: 80,
  endOfLine: "lf",
  tabWidth: 2,
  indentStyle: "space",
  useTabs: true,
  arrowParens: "avoid",
  bracketSameLine: false,
  singleQuote: true,
  trailingComma: "all",
};
