import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: [
    '**/*.test.ts',
    '**/*.property.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/backend/$1',
  },
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/**/*.test.ts',
    '!backend/**/*.property.test.ts',
    '!backend/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
