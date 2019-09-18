import showdown from "showdown";
import * as fs from "fs";
import * as path from "path";

let converter = new showdown.Converter();

// markdown文件转为HTML文件
function convertFile(sourceFile: string, targetFile: string): void {
    try {
        checkDirExist(path.dirname(targetFile));
        let markdownFile = fs.readFileSync(sourceFile).toString();
        let htmlFile = converter.makeHtml(markdownFile);
        htmlFile= htmlFile.replace(/\.md/g, ".html");
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
        let target:string = file.replace(sourceDir, targetDir);
        target = target.replace(/\.[^/.]+$/, ".html");
        convertFile(file, target);
    }
}

// 检查路径
function checkDirExist(folderpath: string): void {
    folderpath = path.join(folderpath);
    const pathArr:string[] = folderpath.split(path.sep);
    let _path:string = '.';
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

const argv = process.argv;
convertDir(argv[2], argv[3]);