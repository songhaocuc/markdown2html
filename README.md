# markdown2html
For personal usage:   
markdown2html with **dir**   
```
node ./build/markdown2html.js -i{markdowndir} [-o {htmldir}] -m "dir"
```
markdown2html with **file**   
```
node ./build/markdown2html.js -i{markdownfile} [-o {htmlFile}] 
```
show **help**
```
node ./build/markdown2html.js -h
```
# TODO
- [x] markdown-it
- [x] markdown all in one
- [x]  argparse
- [x]  webpack

# Build 
## install modules
```
npm install
```
or
```
yarn install
```
## compile typescript 
``` 
tsc
```   

compile `src/app.ts` to `dist/app.js`
## pack
```
npx webpack
```

pack all module into a single js file : `build/markdown2html.js`.