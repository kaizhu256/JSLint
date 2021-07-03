[<img align="left" height="100" src="asset-image-jslint-512.svg"/>](https://github.com/kaizhu256/jslint)


# JSLint, The JavaScript Code Quality Tool

&nbsp;

Douglas Crockford <douglas@crockford.com>


# Status
| Branch | [master<br>(v2021.6.30)](https://github.com/kaizhu256/jslint/tree/master) | [beta<br>(Web Demo)](https://github.com/kaizhu256/jslint/tree/beta) | [alpha<br>(Development)](https://github.com/kaizhu256/jslint/tree/alpha) |
|--:|:--:|:--:|:--:|
| CI | [![ci](https://github.com/kaizhu256/jslint/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/kaizhu256/jslint/actions?query=branch%3Amaster) | [![ci](https://github.com/kaizhu256/jslint/actions/workflows/ci.yml/badge.svg?branch=beta)](https://github.com/kaizhu256/jslint/actions?query=branch%3Abeta) | [![ci](https://github.com/kaizhu256/jslint/actions/workflows/ci.yml/badge.svg?branch=alpha)](https://github.com/kaizhu256/jslint/actions?query=branch%3Aalpha) |
| Coverage | [![coverage](https://kaizhu256.github.io/jslint/branch-master/.build/coverage/coverage-badge.svg)](https://kaizhu256.github.io/jslint/branch-master/.build/coverage/index.html) | [![coverage](https://kaizhu256.github.io/jslint/branch-master/.build/coverage/coverage-badge.svg)](https://kaizhu256.github.io/jslint/branch-master/.build/coverage/index.html) | [![coverage](https://kaizhu256.github.io/jslint/branch-master/.build/coverage/coverage-badge.svg)](https://kaizhu256.github.io/jslint/branch-master/.build/coverage/index.html) |
| Demo | [<img src="asset-image-jslint-512.svg" height="32">](https://kaizhu256.github.io/jslint/branch-master/index.html) | [<img src="asset-image-jslint-512.svg" height="32">](https://kaizhu256.github.io/jslint/branch-master/index.html) | [<img src="asset-image-jslint-512.svg" height="32">](https://kaizhu256.github.io/jslint/branch-master/index.html) |
| Artifacts | [<img src="asset-image-folder-open-solid.svg" height="30">](https://github.com/kaizhu256/jslint/tree/gh-pages/branch-master/.build) | [<img src="asset-image-folder-open-solid.svg" height="30">](https://github.com/kaizhu256/jslint/tree/gh-pages/branch-master/.build) | [<img src="asset-image-folder-open-solid.svg" height="30">](https://github.com/kaizhu256/jslint/tree/gh-pages/branch-master/.build) |


# Web Demo
- https://www.jslint.com

[![screenshot](https://kaizhu256.github.io/jslint/branch-master/.build/screenshot-browser-_2fjslint_2fbranch-beta_2findex.html.png)](https://kaizhu256.github.io/jslint/index.html)


# Install
### 1. To install, just download https://www.jslint.com/jslint.mjs:
```shell
#!/bin/sh

curl -L https://www.jslint.com/jslint.mjs > jslint.mjs
```

### 2. To run `jslint.mjs` from command-line:
```shell <!-- shRunWithScreenshotTxt .build/screenshot-install-cli-file.svg -->
#!/bin/sh

printf "console.log('hello world');\n" > hello.js

node jslint.mjs hello.js
```
- shell output

![screenshot.svg](https://kaizhu256.github.io/jslint/branch-master/.build/screenshot-install-cli-file.svg)

### 3. To import `jslint.mjs` as es-module:
```shell <!-- shRunWithScreenshotTxt .build/screenshot-install-import.svg -->
#!/bin/sh

node --input-type=module -e '

/*jslint devel*/
import jslint from "./jslint.mjs";
let code = "console.log(\u0027hello world\u0027);\n";
let result = jslint(code);
result.warnings.forEach(function ({
    formatted_message
}) {
    console.error(formatted_message);
});

'
```
- shell output

![screenshot.svg](https://kaizhu256.github.io/jslint/branch-master/.build/screenshot-install-import.svg)

### 4. To jslint entire directory:
```shell <!-- shRunWithScreenshotTxt .build/screenshot-install-cli-dir.svg -->
#!/bin/sh

node jslint.mjs .
```
- shell output

![screenshot.svg](https://kaizhu256.github.io/jslint/branch-master/.build/screenshot-install-cli-dir.svg)

<!-- coverage-hack
```javascript
"use strict";
```
-->


# Description
- [jslint.mjs](jslint.mjs) contains the jslint function. It parses and analyzes a source file, returning an object with information about the file. It can also take an object that sets options.

- [index.html](index.html) runs the jslint.mjs function in a web page. The page also depends on `browser.mjs`.

- [browser.mjs](browser.mjs) runs the web user interface and generates the results reports in HTML.

- [help.html](help.html) describes JSLint's usage. Please [read it](https://kaizhu256.github.io/jslint/help.html).

- [function.html](function.html) describes the jslint function and the results it produces.

JSLint can be run anywhere that JavaScript (or Java) can run.

The place to express yourself in programming is in the quality of your ideas and
the efficiency of their execution. The role of style in programming is the same
as in literature: It makes for better reading. A great writer doesn't express
herself by putting the spaces before her commas instead of after, or by putting
extra spaces inside her parentheses. A great writer will slavishly conform to
some rules of style, and that in no way constrains her power to express herself
creatively. See for example William Strunk's The Elements of Style
[https://www.crockford.com/style.html].

This applies to programming as well. Conforming to a consistent style improves
readability, and frees you to express yourself in ways that matter. JSLint here
plays the part of a stern but benevolent editor, helping you to get the style
right so that you can focus your creative energy where it is most needed.


# Files
![screenshot-files.svg](https://kaizhu256.github.io/jslint/branch-master/.build/screenshot-files.svg)


# Changelog
- [Full CHANGELOG.md](CHANGELOG.md)

![screenshot-changelog.svg](https://kaizhu256.github.io/jslint/branch-master/.build/screenshot-changelog.svg)
