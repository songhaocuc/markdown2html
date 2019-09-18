"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var showdown_1 = __importDefault(require("showdown"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var converter = new showdown_1.default.Converter();
// markdown文件转为HTML文件
function convertFile(sourceFile, targetFile) {
    try {
        checkDirExist(path.dirname(targetFile));
        var markdownFile = fs.readFileSync(sourceFile).toString();
        var htmlFile = converter.makeHtml(markdownFile);
        htmlFile = htmlFile.replace(/\.md/g, ".html");
        fs.writeFileSync(targetFile, htmlFile);
    }
    catch (error) {
        console.log(error.toString());
    }
}
// 根据后缀名查找文件
function findFileBySuffix(sourceDir, ext) {
    var files = [];
    var dirArray = fs.readdirSync(sourceDir);
    for (var _i = 0, dirArray_1 = dirArray; _i < dirArray_1.length; _i++) {
        var d = dirArray_1[_i];
        var filePath = path.join(sourceDir, d);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            files = files.concat(findFileBySuffix(filePath, ext));
        }
        if (stat.isFile() && path.extname(filePath) === ext) {
            files.push(filePath);
        }
    }
    return files;
}
// 将路径中的所有markdown文件转换为HTML文件
function convertDir(sourceDir, targetDir) {
    sourceDir = path.join(sourceDir, "");
    targetDir = path.join(targetDir, "");
    var files = findFileBySuffix(sourceDir, ".md");
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var target = file.replace(sourceDir, targetDir);
        target = target.replace(/\.[^/.]+$/, ".html");
        convertFile(file, target);
    }
}
// 检查路径
function checkDirExist(folderpath) {
    folderpath = path.join(folderpath);
    var pathArr = folderpath.split(path.sep);
    var _path = '.';
    for (var i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
            _path = path.join(_path, pathArr[i]);
            console.log(_path);
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
        }
    }
}
var argv = process.argv;
convertDir(argv[2], argv[3]);
//# sourceMappingURL=app.js.map