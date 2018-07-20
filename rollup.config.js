import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace'
import ignore from 'rollup-plugin-ignore'

const cjs = {
  exports: 'named',
  format: 'cjs'
}

const esm = {
  format: 'es'
}

const getCJS = override => Object.assign({}, cjs, override)
const getESM = override => Object.assign({}, esm, override)

const configBase = {
  input: 'src/index.js',
  plugins: [
    babel({
      babelrc: false,
      presets: [['es2015', { modules: false }]],
      plugins: ['external-helpers'],
      runtimeHelpers: true
    })
  ],
}

const serverConfig = Object.assign({}, configBase, {
  output: [
    getESM({ file: 'dist/png-js.es.js' }),
    getCJS({ file: 'dist/png-js.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(false),
    })
  ),
  external: ['fs']
})

const serverProdConfig = Object.assign({}, serverConfig, {
  output: [
    getESM({ file: 'dist/png-js.es.min.js' }),
    getCJS({ file: 'dist/png-js.cjs.min.js' }),
  ],
  plugins: serverConfig.plugins.concat(
    uglify()
  ),
})

const browserConfig = Object.assign({}, configBase, {
  output: [
    getESM({ file: 'dist/png-js.browser.es.js' }),
    getCJS({ file: 'dist/png-js.browser.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(true),
      "png-js": "png-js/png.js"
    }),
    ignore(['fs'])
  )
})

const browserProdConfig = Object.assign({}, browserConfig, {
  output: [
    getESM({ file: 'dist/png-js.browser.es.min.js' }),
    getCJS({ file: 'dist/png-js.browser.cjs.min.js' }),
  ],
  plugins: browserConfig.plugins.concat(
    uglify()
  ),
})

export default [
  serverConfig,
  serverProdConfig,
  browserConfig,
  browserProdConfig
]
