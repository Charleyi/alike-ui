const path = require('path');

module.exports = {
    pages: {
        index: {// 构建应用入口
            entry: 'src/main.js',  
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    devServer: {
        proxy: {// API请求代理到API服务器
            '/api': {
                target: 'http://jsonplaceholder.typicode.com',
                ws: true,
                changeOrigin: true
            }
        }
    },
    css: {
        loaderOptions: {// 向预处理器Loader传递选项，共享Sass/Scss全局变量
            scss: {
                additionalData: `@import '@/assets/css/variables.scss';`
            }
        }
    },
    chainWebpack: config => {
        // 配置路径别名
        config.resolve.alias.set('@',path.join(__dirname,'./src'))
        .set('~img',path.join(__dirname,'./src/assets/img'))

        // 解决ie11兼容ES6
        config.entry('main').add('babel-polyfill')

        // 构建模块是配置的config.module会与jsx模块依赖冲突
        // config.module
        //     .rule('js')
        //     .include.add(path.resolve(__dirname,'./packages')).end()
        //     .use('babel')
        //     .loader('babel-loader')
        //     .tap(options => {
        //         return options
        //     })
    },
    transpileDependencies: [
        'biyi-admin', // 指定对第三方依赖包进行babel-polyfill处理
    ]
}