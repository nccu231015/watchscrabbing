const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  // Other Webpack configurations...
  externals: [
    nodeExternals({
      allowlist: ["zlib-sync"], // Allow list any package you need
    }),
  ],

  // Configure loaders if necessary
  module: {
    rules: [
      {
        test: /\.node$/,
        use: "node-loader",
        include: path.resolve(
          __dirname,
          "node_modules/zlib-sync/build/Release"
        ),
      },
    ],
  },
};
