"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Converter_1 = __importDefault(require("./Converter"));
var argparse_1 = __importDefault(require("argparse"));
var parser = new argparse_1.default.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Markdown to HTML Converter.'
});
parser.addArgument(['-i', '--input'], {
    required: true,
    help: 'input file or dir name.(default file, set by "-m" or "--mode")'
});
parser.addArgument(['-o', '--output'], {
    help: 'out file or dir name.(same mode as input)'
});
parser.addArgument(['-m', '--mode'], {
    defaultValue: 'file',
    help: 'assign mode("file" or "dir", default file).Default same as Input'
});
var args = parser.parseArgs();
// console.dir(args);
var input = args["input"];
var output = args["output"];
var mode = args["mode"];
if (mode === "file") {
    if (input.indexOf(".md") < 0 && input.indexOf(".markdown")) {
        console.log("input file should be markdown(.md or .markdown) file.");
    }
    else {
        output = output || input.replace(/\.[^/.]+$/, ".html");
        Converter_1.default.convertFile(input, output);
    }
}
else if (mode === "dir") {
    output = input;
    Converter_1.default.convertDir(input, output);
}
else {
    console.log('error mode, please see "-h" or "--help"');
}
//# sourceMappingURL=app.js.map