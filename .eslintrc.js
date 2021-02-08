module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/ban-types": "off",
        "only-arrow-functions": ["off"],
        "quotes": ["error", "double", {"allowTemplateLiterals": true}],
        // "forin": false,  // TODO: check if there is a way to change this
        "object-shorthand": "warn",
        "no-console": "warn",
        "no-shadow": ["error", {builtinGlobals: true}]
    }
};