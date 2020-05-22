const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');

const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('postcss-hexrgba'),
  require('autoprefixer'),
];

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy images', () => {
      fse.copySync('./app/assets/images', './docs/assets/images');
    });
  }
}

const cssConfig = {
  test: /\.css$/i,
  use: [
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: postCSSPlugins,
      },
    },
  ],
};

const pages = fse
  .readdirSync('./app')
  .filter((file) => {
    return file.endsWith('.html');
  })
  .map((page) => {
    return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`,
    });
  });

const config = {
  entry: './app/assets/js/App.js',
  plugins: pages,
  module: {
    rules: [cssConfig],
  },
};

if (currentTask === 'start') {
  cssConfig.use.unshift('style-loader');
  config.output = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app'),
  };
  config.devServer = {
    // html file auto reload
    before: (app, server) => {
      server._watch('./app/**/*.html');
    },
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    // host: '0.0.0.0',
  };
  config.mode = 'development';
}

if (currentTask === 'build') {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  });
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  postCSSPlugins.push(require('cssnano'));
  config.output = {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'docs'),
  };
  config.mode = 'production';
  config.optimization = {
    splitChunks: { chunks: 'all' },
  };
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'style.[chunkhash].css' }),
    new RunAfterCompile()
  );
}

module.exports = config;
