import { markdown } from "markdown";
import * as fs from "fs";
import * as path from "path";

// let markdown_file:string = fs.readFileSync("test.md").toString();
// console.log(markdown_file);
// let html_file:string = markdown.toHTML(markdown_file);
// fs.writeFileSync("test.html", html_file);

// markdown文件转为HTML文件
function convertFile(sourceFile: string, targetFile: string): void {
    try {
        let markdownFile = fs.readFileSync(sourceFile).toString();
        let htmlFile = markdown.toHTML(markdownFile);
        fs.writeFileSync(targetFile, htmlFile);
    } catch (error) {
        console.log(error.toString());
    }
}

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
        let target = file.replace(sourceDir, targetDir);
        convertFile(file, target);
    }
}

console.log(findFileBySuffix("./", ".md"));

const argv = process.argv;
convertDir(argv[1], argv[2]);