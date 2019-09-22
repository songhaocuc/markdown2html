'use strict';
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
var markdown_it_1 = __importDefault(require("markdown-it"));
var highlight_js_1 = __importDefault(require("highlight.js"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var util_1 = require("./util");
var md = new markdown_it_1.default({
    html: true,
    highlight: function (str, lang) {
        if (lang && highlight_js_1.default.getLanguage(lang)) {
            try {
                return '<pre><code>' +
                    highlight_js_1.default.highlight(lang, str, true).value +
                    '</code></pre>';
            }
            catch (__) { }
        }
        return '<pre><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
var slugCounts = {};
addNamedHeaders(md);
// Adapted from <https://github.com/leff/markdown-it-named-headers/blob/master/index.js>
// and <https://github.com/Microsoft/vscode/blob/cadd6586c6656e0c7df3b15ad01c5c4030da5d46/extensions/markdown-language-features/src/markdownEngine.ts#L225>
function addNamedHeaders(md) {
    var originalHeadingOpen = md.renderer.rules.heading_open;
    md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
        var title = tokens[idx + 1].children.reduce(function (acc, t) { return acc + t.content; }, '');
        var slug = util_1.slugify(title);
        if (slugCounts.hasOwnProperty(slug)) {
            slugCounts[slug] += 1;
            slug += '-' + slugCounts[slug];
        }
        else {
            slugCounts[slug] = 0;
        }
        tokens[idx].attrs = tokens[idx].attrs || [];
        tokens[idx].attrs.push(['id', slug]);
        if (originalHeadingOpen) {
            return originalHeadingOpen(tokens, idx, options, env, self);
        }
        else {
            return self.renderToken(tokens, idx, options);
        }
    };
}
// markdown文件转为HTML文件
function convertFile(sourceFile, targetFile) {
    try {
        checkDirExist(path.dirname(targetFile));
        var markdownFile = fs.readFileSync(sourceFile).toString();
        var htmlFile = md.render(markdownFile);
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
        console.log("markdown files:");
        console.log(files);
        var target = file.replace(sourceDir, targetDir);
        target = target.replace(/\.[^/.]+$/, ".html");
        convertFile(file, target);
    }
}
// 检查路径
function checkDirExist(folderpath) {
    folderpath = path.join(folderpath, "");
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
exports.default = { convertDir: convertDir, convertFile: convertFile };
//# sourceMappingURL=Converter.js.map