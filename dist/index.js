#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
// import fs and path modules
const fs = require('fs');
const path = require('path');
const figlet = require('figlet');
const program = new commander_1.Command();
console.log(figlet.textSync('Dir Manager'));
program
    .version('1.0.0')
    .description('An example CLI for managing a directory')
    .option('-l, --ls [value]', 'List directory contents') // [value]는 optional
    .option('-m, --mkdir <value>', 'Create a directory')
    .option('-t, --touch <value>', 'Create a file')
    .parse(process.argv);
const options = program.opts(); // 옵션 변수를 객체로 반환
function listDirContents(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.promises.readdir(filepath); // 디렉토리 내용을 읽음
            const detailedFilesPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                let fileDetails = yield fs.promises.lstat(path.resolve(filepath, file)); //size, birthtime 및 info와 같은 파일에 대한 자세한 정보를 가져옴
                const { size, birthtime } = fileDetails;
                return { filename: file, 'size(KB)': size, created_at: birthtime };
            }));
            const detailedFiles = yield Promise.all(detailedFilesPromises);
            console.table(detailedFiles);
        }
        catch (error) {
            console.error('Error occurred while reading the directory!', error);
        }
    });
}
function createDir(filepath) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log('The directory has been created successfully');
    }
}
function createFile(filepath) {
    fs.openSync(filepath, 'w');
    console.log('An empty file has been created');
}
if (options.ls) {
    const filepath = typeof options.ls === 'string' ? options.ls : __dirname;
    listDirContents(filepath);
}
if (options.mkdir) {
    createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map