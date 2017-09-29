const webpack = require('webpack');
const WDS = require('webpack-dev-server');
const config = require('./webpack.dev.config.js');

const PORT = process.env.PORT || 5000;

new WDS(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true
}).listen(PORT, (err, res) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Listening at http://localhost:${PORT}`);
  return res;
});
