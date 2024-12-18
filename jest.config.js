module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
    moduleDirectories: ['node_modules', 'src'],
    globals: {
      'ts-jest': {
        tsconfig: './tsconfig.json',
      },
    },
  };
  