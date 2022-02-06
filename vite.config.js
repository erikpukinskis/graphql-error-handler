const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'graphql-error-handler',
      fileName: (format) => `my-lib.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['graphql', '@apollo/client'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'graphql': 'GraphQL',
          '@apollo/client': 'ApolloClient',
        },
      },
    },
    sourcemap: true,
  },
})