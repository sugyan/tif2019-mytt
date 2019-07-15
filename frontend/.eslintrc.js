module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react"
    ],
    "rules": {
        "semi": "warn",
        "quotes": "warn",
        "comma-dangle": ["warn", {
            "functions": "always-multiline"
        }]
    }
};
