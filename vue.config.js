const publicPath=process.env.VUE_APP_PUBLIC_PATH||'/';
var webpack = require('webpack');

module.exports = {
  runtimeCompiler: true,
  publicPath,
  devServer: {
    port:4000
	/*,    
    proxyTable: {},
    env: require('./dev.env'),
    port: 4545,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: false*/
  },
  chainWebpack: config => {
    config.optimization.splitChunks({
        ...config.optimization.get('splitChunks'),
        automaticNameDelimiter: '_'
    })
},
  configureWebpack: {
    /*output2: {
      chunkFilename2:(d)=>{
        console.log(d);
      },
      filename: (chunkData) => {
        console.log(chunkData.chunk.name);
        return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
      },
    },*/
    //output: {
      /*filename: ({ chunk: { name } }) => {
        console.log(name);
        return name === 'main' ? '[name].js': '[name]/[name].js';
      },*/
      /*chunkFilename: 'js2/[name]_[chunkhash].js'*/
      /*filename: (pathData) => {
        console.log(pathData.chunk.name);
        return pathData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js';
      },*/
   // },
    plugins: [
      /*new ChunkRenamePlugin({
        initialChunks: true,
        mySpecialChunk: "specialName.[name].js",
      }),*/
      new webpack.LoaderOptionsPlugin({
        options: {
          customInterpolateName: (url, name, options) => {
            /*console.log('url='+url);
            if(url.endsWith('js')){
              console.log('url='+url);
              console.log('url2='+url.replace(/~/g, '_'));
              console.log('name='+name);
              console.log(options);
            }*/
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