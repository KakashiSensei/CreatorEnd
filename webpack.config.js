const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, "src", "index.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    devtool: 'eval',
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.jpg', '.png']
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
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["es2015", "react", "stage-2", "react-hmre"]
                }
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
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff&name=src/asset/font/[name].[ext]"
            },
            {
                test: /\.(ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader?name=src/asset/font/[name].[ext]"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'REST_API': JSON.stringify('http://localhost:3000'),
                'APP_ID': JSON.stringify("1866917183572616")
            }
        }),
    ]
}