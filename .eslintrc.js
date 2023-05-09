module.exports = {
    extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    parserOptions: {
        project: './tsconfig.json',
    },
    rules: {
        'max-len': [
            'error',
            120,
            2,
            {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: false,
                ignoreTemplateLiterals: false,
            },
        ],
        'class-methods-use-this': 0,
        'prettier/prettier': ['error'],
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4],
        'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    },
};
