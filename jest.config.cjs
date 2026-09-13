/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|webp|svg)$": "<rootDir>/src/test/file.mock.cjs",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^lucide-react$": "<rootDir>/src/test/lucide.mock.cjs",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          target: "ES2022",
          lib: ["ES2022", "DOM"],
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          esModuleInterop: true,
          isolatedModules: true,
          strict: true,
          types: ["jest", "node", "@testing-library/jest-dom"],
        },
      },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/test/**",
    "!src/assets/**",
    "!src/components/ui/**",
    "!src/hooks/use-mobile.ts",
  ],
  coverageThreshold: {
    global: { branches: 100, functions: 100, lines: 100, statements: 100 },
  },
};
