module.exports = {
    entry:  __dirname + "/dist/app.js",
    output: {
      path: __dirname + "/build",//打包后的文件存放的地方
      filename: "md2html.js"//打包后输出文件的文件名
    }
  }