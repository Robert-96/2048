const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/public', to: 'public' },
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      meta: {
        'description': { name: 'description', contnet: '2048 is played on a gray 4×4 grid, with numbered tiles that slide when a player moves them using the four arrow keys.' },
        'keyword': { name: 'keywords', content: '2048, Puzzle, Game, HTML, CSS, JavaScript, GitHub' },
        'og:title': { property: 'og:title', content: '2048 - a single-player sliding block puzzle game.' },
        'og:description': { property: 'og:description', content: '2048 is played on a gray 4×4 grid, with numbered tiles that slide when a player moves them using the four arrow keys.' },
        'og:type': { property: 'og:type', content: 'website' },
        'og:url': { property: 'og:url', content: 'https://robert-96.github.io/2048' },
        'og:image': { property: 'og:image', content: 'https://robert-96.github.io/2048/public/preview.png' },
        'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
        'twitter:title': { name: 'twitter:title', content: '2048 - a single-player sliding block puzzle game.' },
        'twitter:description': { name: 'twitter:description', content: '2048 is played on a gray 4×4 grid, with numbered tiles that slide when a player moves them using the four arrow keys.' },
        'twitter:image': { name: 'twitter:image', content: 'https://robert-96.github.io/2048/public/preview.png' }
      }
    }),
    new FaviconsWebpackPlugin({
      logo: './src/public/2048.png',
      mode: 'webapp',
      devMode: 'webapp',
      favicons: {
        appName: '2048 - a single-player sliding block puzzle game',
        appShortName: '2048',
        appDescription: '2048 is played on a gray 4×4 grid, with numbered tiles that slide when a player moves them using the four arrow keys.',
        theme_color: '#2D3748',
        orientation: 'portrait',
        scope: '/2048/',
        start_url: '/2048/'
      }
    })
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              "@babel/plugin-proposal-class-properties"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss')('./tailwind.config.js'),
                require('autoprefixer')
              ],
            },
          },
        ],
      }
    ]
  }
};