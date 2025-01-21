const nextJest = require('next/jest')
 
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    
  },
  // Add more setup options before each test is run
  coveragePathIgnorePatterns: [
    './node_modules',
    './interceptor/Interceptor.jsx',
    './services/ApiServices.jsx',
    './middlewares/authmiddleware.js'
   
  ],


}




 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)

