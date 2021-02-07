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
        "only-arrow-functions": "off",
        "no-namespace": "off",
        "quotes": ["error", "double"],
        // "forin": false,  // TODO: check if there is a way to change this
        "object-literal-shorthand": "warn",
        "no-console": "warn",
        "no-shadowed-variable": "warn"
    }
};