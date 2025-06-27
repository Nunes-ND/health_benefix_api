import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["tests/**/*.test.ts"],
		pool: "threads",
		poolOptions: {
			threads: {
				isolate: true,
				minThreads: 1,
				maxThreads: 4,
			},
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			reportsDirectory: "./coverage",
			include: ["src/**/*.ts"],
			exclude: ["src/main.ts"],
			all: true,
		},
		passWithNoTests: true,
	},
	plugins: [
		tsconfigPaths({
			projects: ["./tsconfig.json"],
		}),
	],
});
