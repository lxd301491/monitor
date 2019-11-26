const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
// const babel = require('rollup-plugin-babel');
const rollup = require("rollup");
const builtins = require("rollup-plugin-node-builtins");

// see below for details on the options
const inputOptions = {
  input: "types/index.d.ts",
  plugins: [
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
    }),

    // babel({
    //   runtimeHelpers: true,
    //   exclude: 'node_modules/**'
    // })
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
    file: "dist/monitor.esm.js",
    format: "es"
  }
];

async function build() {
  try {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    outputOptions.forEach(async output => {
      // generate code and a sourcemap
      const { code, map } = await bundle.generate(output);

      // or write the bundle to disk
      await bundle.write(output);
    });
  } catch (error) {
    console.error(error);
  }
}

build();
