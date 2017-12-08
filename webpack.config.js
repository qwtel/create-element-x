const { resolve } = require('path');

const {
  BannerPlugin,
  EnvironmentPlugin,
  optimize: {
    UglifyJsPlugin,
    ModuleConcatenationPlugin,
  },
} = require('webpack');

const merge = require('webpack-merge');
const { argv: { env } } = require('yargs');
const camelcase = require('camelcase');

const { name: filename } = require('./package.json');

const library = camelcase(filename);
const min = env === 'prod' ? '.min' : '';
const banner = String.prototype.trim.call(`
Copyright (c) 2017 Florian Klampfer <https://qwtel.com/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`);

function envConfig() {
  switch (env) {
    case 'prod':
      return {
        plugins: [
          new BannerPlugin({ banner }),
          new EnvironmentPlugin({ DEBUG: false }),
          new UglifyJsPlugin(),
        ],
      };

    default:
      return {
        devtool: 'source-map',
        plugins: [
          new EnvironmentPlugin({ DEBUG: true }),
        ],
      };
  }
}

const baseConfig = merge({
  output: {
    path: resolve('./dist'),
    library,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    modules: [
      resolve('./node_modules'),
      resolve(process.env.NODE_PATH), // TODO: save?
    ],
    extensions: ['.json', '.js'],
    symlinks: true,
  },
  plugins: [
    new ModuleConcatenationPlugin(),
  ],
}, envConfig());

const config = [
  merge(baseConfig, {
    entry: resolve('./index.js'),
    output: {
      filename: `index${min}.js`,
    },
  }),
  merge(baseConfig, {
    entry: resolve('./library.js'),
    output: {
      filename: `library${min}.js`,
    },
  }),
];

module.exports = config;
