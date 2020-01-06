const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript2");
// const babel = require('rollup-plugin-babel');
const rollup = require("rollup");
const builtins = require("rollup-plugin-node-builtins");
const replace = require("rollup-plugin-replace");
const terser = require("rollup-plugin-terser").terser;
const program = require('commander');
let pkg = require('./package.json');

program
  .option("-d, --debug", "launch debug mode")
  .option("-t, --target <target>", "optional range umd,cjs,ems")
program.parse(process.argv);
if (program.debug) console.log(program.opts());

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
  external: []
};
const outputOptions = [
  {
    file: "dist/monitor.js",
    format: "umd",
    name: "Monitor",
    sourceMap: true //代码映射，方便调试3
  },
  {
    file: "dist/monitor.min.js",
    format: "umd",
    name: "Monitor",
    uglify: true
  },
  {
    file: "dist/monitor.cjs.js",
    format: "cjs",
    globals: {
      axios: 'Window.axios',
      localforage: 'window.localforage',
      pako: 'Window.pako'
    }
  },
  {
    file: "dist/monitor.cjs.min.js",
    format: "cjs",
    uglify: true,
    globals: {
      axios: 'Window.axios',
      localforage: 'window.localforage',
      pako: 'Window.pako'
    }
  },
  {
    file: "dist/monitor.esm.js",
    format: "es",
    globals: {
      axios: 'Window.axios',
      localforage: 'window.localforage',
      pako: 'Window.pako'
    }
  },
  {
    file: "dist/monitor.esm.min.js",
    format: "es",
    uglify: true,
    globals: {
      axios: 'Window.axios',
      localforage: 'window.localforage',
      pako: 'Window.pako'
    }
  }
];

function buildConfigs(inputs, outputs) {
  return outputs.filter(output => {
    return program.target && !program.target.split(",").includes(output.format) ? false : true;
  }).map(output => {
    let config = {
      input: inputs.input,
      plugins: [...inputs.plugins],
      external: [...inputs.external]
    };
    if (output.globals) {
      config.external = config.external.concat(Object.keys(output.globals))
    }
    if (output.uglify === true) {
      config.plugins.push(terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }))
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
