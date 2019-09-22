'use strict';


import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import * as fs from "fs";
import * as path from "path";
import { slugify } from './util';

let md:MarkdownIt = new MarkdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
let slugCounts: { [key: string]: number; }  = {};
addNamedHeaders(md);

// Adapted from <https://github.com/leff/markdown-it-named-headers/blob/master/index.js>
// and <https://github.com/Microsoft/vscode/blob/cadd6586c6656e0c7df3b15ad01c5c4030da5d46/extensions/markdown-language-features/src/markdownEngine.ts#L225>
function addNamedHeaders(md: MarkdownIt): void {
    const originalHeadingOpen = md.renderer.rules.heading_open;

    md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
        const title = tokens[idx + 1].children.reduce((acc: string, t: any) => acc + t.content, '');
        let slug = slugify(title);

        if (slugCounts.hasOwnProperty(slug)) {
            slugCounts[slug] += 1;
            slug += '-' + slugCounts[slug];
        } else {
            slugCounts[slug] = 0;
        }

        tokens[idx].attrs = tokens[idx].attrs || [];
        tokens[idx].attrs.push(['id', slug]);

        if (originalHeadingOpen) {
            return originalHeadingOpen(tokens, idx, options, env, self);
        } else {
            return self.renderToken(tokens, idx, options);
        }
    };
}

// markdown文件转为HTML文件
function convertFile(sourceFile: string, targetFile: string): void {   
    try {
        checkDirExist(path.dirname(targetFile));
        let markdownFile = fs.readFileSync(sourceFile).toString();
        let htmlFile = md.render(markdownFile);
        htmlFile = htmlFile.replace(/\.md/g, ".html");
        fs.writeFileSync(targetFile, htmlFile);
    } catch (error) {
        console.log(error.toString());
    }
}

// 根据后缀名查找文件
function findFileBySuffix(sourceDir: string, ext: string): string[] {
    let files: string[] = [];
    let dirArray = fs.readdirSync(sourceDir);
    for (let d of dirArray) {
        let filePath = path.join(sourceDir, d)
        let stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            files = files.concat(findFileBySuffix(filePath, ext))
        }
        if (stat.isFile() && path.extname(filePath) === ext) {
            files.push(filePath)
        }
    }
    return files
}


// 将路径中的所有markdown文件转换为HTML文件
function convertDir(sourceDir: string, targetDir: string): void {
    sourceDir = path.join(sourceDir, "");
    targetDir = path.join(targetDir, "");
    let files = findFileBySuffix(sourceDir, ".md");
    for (let file of files) {
        console.log("markdown files:")
        console.log(files);
        let target: string = file.replace(sourceDir, targetDir);
        target = target.replace(/\.[^/.]+$/, ".html");
        convertFile(file, target);
    }
}

// 检查路径
function checkDirExist(folderpath: string): void {
    folderpath = path.join(folderpath,"");
    const pathArr: string[] = folderpath.split(path.sep);
    let _path: string = '.';
    for (let i = 0; i < pathArr.length; i++) {
        if (pathArr[i]) {
            _path = path.join(_path, pathArr[i]);
            console.log(_path);
            if (!fs.existsSync(_path)) {
                fs.mkdirSync(_path);
            }
        }
    }
}

export default {convertDir, convertFile};