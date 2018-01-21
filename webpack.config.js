const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    devtool: 'cheap-source-map',
    resolve: {
        // Look for modules in .ts(x) files first, then .js
        extensions: ['.ts', '.tsx', '.js', '.css', '.jpg', '.png'],

        // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
        modules: ['src', 'node_modules'],
    },
    stats: {
        colors: true,
        reasons: true,
        chunks: true
    },
    devServer: {
        publicPath: "/dist",
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ],
                include: path.resolve("src")
            },
            {
                test: /\.css?$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: "file-loader?name=src/asset/[name].[ext]"
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=src/asset/font/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process': {
                'env': {
                    'NODE_ENV': JSON.stringify('development'),
                    'REST_API': JSON.stringify('http://localhost:3000'),
                    'APP_ID': JSON.stringify("1866917183572616")
                }
            }
        })
    ]
}