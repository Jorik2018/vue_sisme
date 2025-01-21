const publicPath=process.env.VUE_APP_PUBLIC_PATH||'/';
var webpack = require('webpack');
process.env.VUE_APP_VERSION = require('./package.json').version;
var d=new Date();
function de(v){return v.length < 2?('0'+v):v};

process.env.VUE_APP_BUILT_ON = 
[d.getFullYear(), '' + de(''+(d.getMonth() + 1)), de('' + d.getDate())].join('-')+' '+
[de(''+d.getHours()), de(''+d.getMinutes()), de(''+d.getSeconds())].join(':');

module.exports = {
  runtimeCompiler: true,
  publicPath,
  devServer: {
    port:4000
  },
  chainWebpack: config => {
    config.optimization.splitChunks({
        ...config.optimization.get('splitChunks'),
        automaticNameDelimiter: '_'
    })
},
  configureWebpack: {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          customInterpolateName: (url, name, options) => {
            return url.replace(/~/g, '_');
          },
            customInterpolateNamew: (loaderContext) => {
                return loaderContext.replace(/~/g, '_');
            }
        }
    })
    ]
  }
}