const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FontminPlugin = require('fontmin-webpack')

const srcDir = path.resolve(__dirname, '..', 'src')
const distDir = path.resolve(__dirname, '../../backend/templates', 'dist')
const staticDir = path.resolve(__dirname, '../../backend/static', 'dist')
const { NODE_ENV = 'development' } = process.env

module.exports = {
  context: srcDir,
  devtool: 'source-map',

  entry: [
    './index.js'
  ],

  output: {
    filename: 'main.js',
    path: staticDir,
    publicPath: '/static/dist/',
    sourceMapFilename: 'main.map'
  },

  devServer: {
    contentBase: srcDir,
    publicPath: '/',
    historyApiFallback: true,
    port: 3000
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, "./node_modules"),
        use: [
          'babel-loader'
        ],
        include: srcDir
      },
      {
        test: /\.css$/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=assets/css/'
        ]
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        query: {
          partialDirs: [
            path.join(srcDir, 'templates', 'partials')
          ]
        }
      },
      {
        test: /\.(eot?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
        use: 'file-loader?name=[name].[ext]&outputPath=assets/fonts/'
      },
      {
        test: /\.(ico)$/,
        use: [
          'url-loader?limit=21000&name=assets/img/[name].[ext]'
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=assets/img/'
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          'file-loader?name=[name].[ext]&outputPath=assets/img/svg/'
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(NODE_ENV)
      },
      'NODE_ENV': NODE_ENV,
      '__DEV__': NODE_ENV === 'development',
      '__PROD__': NODE_ENV === 'production'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),

    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'index.hbs'),

      path: distDir,
      filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      tether: 'tether',
      Tether: 'tether',
      'window.Tether': 'tether',
    })

  ]
}