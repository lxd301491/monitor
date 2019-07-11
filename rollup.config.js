const nodeResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const rollup = require('rollup');

// see below for details on the options
const inputOptions = {
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: "tsconfig.json"
    }),
    babel({
      exclude: 'node_modules/**'
    })
	]

};
const outputOptions = [
  {
    file: 'dist/monitor.js',
    format: 'umd',
    name: 'Monitor',
    sourceMap: true, //代码映射，方便调试
  },
  {
    file: 'dist/monitor.cjs.js',
    format: 'cjs'
  },
  {
    file: 'dist/monitor.esm.js',
    format: 'es'
  },
]

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  outputOptions.forEach(async output => {
    // generate code and a sourcemap
    const { code, map } = await bundle.generate(output);

    // or write the bundle to disk
    await bundle.write(output);
  })
}

build();