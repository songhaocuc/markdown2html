import converter from "./Converter";
import ArgumentParser from "argparse";

var parser = new ArgumentParser.ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Markdown to HTML Converter.'
});

parser.addArgument(
    ['-i', '--input'],{
        required: true,
        help:'input file or dir name.(default file, set by "-m" or "--mode")'
    }
);

parser.addArgument(
    ['-o', '--output'],{
        help:'out file or dir name.(same mode as input)'
    }
);

parser.addArgument(
    ['-m', '--mode'],{
        defaultValue: 'file',
        help:'assign mode("file" or "dir", default file).Default same as Input'
    }
);

let args = parser.parseArgs();
// console.dir(args);

let input:string = args["input"];
let output:string = args["output"];
let mode:string = args["mode"];

if(mode === "file"){
    if(input.indexOf(".md") < 0 && input.indexOf(".markdown")){
        console.log("input file should be markdown(.md or .markdown) file.");
    }else{
        output = output || input.replace(/\.[^/.]+$/, ".html");
        converter.convertFile(input, output);
    }
}else if (mode === "dir"){
    output = input;
    converter.convertDir(input, output);
}else{
    console.log('error mode, please see "-h" or "--help"');
}
