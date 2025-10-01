// eslint.config.js
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.{js,ts,jsx,tsx}"], 
		ignores: ["playwright-report/**", "test-results/**"],
		rules: {
			semi: "error",
			"prefer-const": "error",
		},
	},
]);
