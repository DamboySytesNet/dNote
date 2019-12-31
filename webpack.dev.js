const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    target: 'electron-renderer',
    entry: {
        index: './src/ts/index.ts',
    },
    output: {
        filename: '[name].js',
        path: `${__dirname}/dist/`
    },
    node: {
        __dirname: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    'ts-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /icons(\/|\\).*\.(svg|png|jpg|gif|jpeg)$/,
                exclude: /(\/|\\)app(\/|\\).*.png/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[hash].[ext]',
                        publicPath: './icons/',
                        outputPath: './icons/'
                    }
                }
            },
            {
                test: /(\/|\\)app(\/|\\).*.png$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: './icons/',
                        outputPath: './icons/'
                    }
                }
            },
            {
                test: /\.(woff2?|ttf|otf|eot)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: './fonts/',
                        outputPath: './fonts/'
                    }
                }
            },
            {
                test: /\.json$/,
                use: {
                    loader: 'json-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './data/'
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './[name].css'
        }),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html'
        }),
    ]
}
