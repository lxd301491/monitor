const uglify = require("rollup-plugin-uglify").uglify;
const uglifyEs = require("rollup-plugin-uglify-es");
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
// const babel = require('rollup-plugin-babel');
const rollup = require("rollup");
const builtins = require("rollup-plugin-node-builtins");
const replace = require("rollup-plugin-replace");
let pkg = require('./package.json');


// see below for details on the options
const inputOptions = {
  input: "types/index.d.ts",
  plugins: [
    replace({
      VERSION: pkg.version,
      delimiters: ['{{', '}}']
    }),
    nodeResolve({
      browser: true,
      preferBuiltins:true
    }),
    builtins(),
    commonjs({
      include: 'node_modules/**',
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      clean: true,
      rollupCommonJSResolveHack: true
    })
  ],
  external: [
    "http",
    "https",
    "url",
    "assert",
    "stream",
    "tty",
    "util",
    "os",
    "zlib"
  ]
};
const outputOptions = [
  {
    file: "dist/monitor.js",
    format: "umd",
    name: "PAMonitor",
    sourceMap: true //代码映射，方便调试
  },
  {
    file: "dist/monitor.cjs.js",
    format: "cjs"
  },
  {
    file: "dist/monitor.cjs.min.js",
    format: "cjs",
    uglify: true
  },
  {
    file: "dist/monitor.esm.js",
    format: "es"
  },
  {
    file: "dist/monitor.esm.min.js",
    format: "es",
    uglify: true
  }
];

function buildConfigs(inputs, outputs) {
  return outputs.map(output => {
    let config = {
      input: inputs.input,
      plugins: [...inputs.plugins],
      external: [...inputs.external]
    };
    if (output.uglify === true) {
      if (output.format === 'es') {
        config.plugins.push(uglifyEs());
      } else {
        config.plugins.push(uglify());
      }
    }
    config.output = output;
    return config;
  });
}

async function build() {
  try {
    const configs = buildConfigs(inputOptions, outputOptions);
    configs.forEach(async config => {
      // create a bundle
      const bundle = await rollup.rollup(config);
      // generate code and a sourcemap
      const { code, map } = await bundle.generate(config.output);

      // or write the bundle to disk
      await bundle.write(config.output);
    });
  } catch (error) {
    console.error(error);
  }
}

build();
