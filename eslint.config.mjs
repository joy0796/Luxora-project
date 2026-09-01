// import { defineConfig, globalIgnores } from "eslint/config";
// import nextVitals from "eslint-config-next/core-web-vitals";
// export default defineConfig([...nextVitals, globalIgnores([".next/**","out/**","build/**","next-env.d.ts"])]);

import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];