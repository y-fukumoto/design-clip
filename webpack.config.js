const path = require('path');
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    'app': './src/app.js',
    'index': './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'public/javascripts'),
    publicPath: '/javascripts/',
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      vuex: 'vuex/dist/vuex.js',
      jquery: path.join(__dirname, 'node_modules', 'jquery')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [{
          loader: 'vue-loader'
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 8080,
    proxy: {
      '/': 'http://localhost:8000',
      '/auth/*': 'http://localhost:8000',
      '/api/*': 'http://localhost:8000',
      '/logout': 'http://localhost:8000'
    }
  }
}