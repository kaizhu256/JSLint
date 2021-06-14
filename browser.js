// browser.js
// 2018-06-16
// Copyright (c) 2015 Douglas Crockford  (www.JSLint.com)

/*jslint
    browser
*/

/*property
    CodeMirror, Tab,
    extraKeys,
    fromTextArea,
    getOption, getValue,
    indentUnit, indentWithTabs,
    jslint_result,
    lineNumbers, lineWrapping,
    matchBrackets, mode,
    repeat, replaceSelection,
    setValue, showTrailingSpace,
    addEventListener, ctrlKey, key, querySelector, line_source, stack_trace,
    checked, closure, column, context, create, disable, display, edition,
    exports, filter, focus, forEach, froms, functions, getElementById,
    global, id, innerHTML, isArray, join, json, keys, length, level, line,
    lines, map, message, module, name, names, onchange, onclick, onscroll,
    option, parameters, parent, property, push, querySelectorAll, replace, role,
    scrollTop, select, signature, sort, split, stop, style, title, trim, value,
    warnings
*/

import jslint from "./jslint.js";

// This is the web script companion file for JSLint. It includes code for
// interacting with the browser and displaying the reports.

const elem_boxes = document.querySelectorAll("[type=checkbox]");
const elem_global = document.getElementById("JSLINT_GLOBAL");
const elem_property = document.getElementById("JSLINT_PROPERTY");
const elem_property_fieldset = document.getElementById(
    "JSLINT_PROPERTYFIELDSET"
);
const elem_report_field = document.getElementById("JSLINT_REPORT");
const elem_report_list = document.getElementById("JSLINT_REPORT_LIST");
const elem_source = document.getElementById("JSLINT_SOURCE");
const elem_warnings_list = document.getElementById("JSLINT_WARNINGS_LIST");
const rx_amp = /&/g;
const rx_gt = />/g;
const rx_lt = /</g;
let editor;

function entityify(string) {

// Replace & < > with less destructive entities.

    return String(
        string
    ).replace(
        rx_amp,
        "&amp;"
    ).replace(
        rx_lt,
        "&lt;"
    ).replace(
        rx_gt,
        "&gt;"
    );
}

function error_report(data) {

// Produce the HTML Error Report.

// <cite><address>LINE_NUMBER</address>MESSAGE</cite>
// <samp>EVIDENCE</samp>

    let output = [];
    if (data.stop) {
        output.push("<center>JSLint was unable to finish.</center>");
    }
    data.warnings.forEach(function ({
        column,
        line,
        line_source,
        message,
        stack_trace = ""
    }) {
        output.push(
            "<cite><address>",
            entityify(line),
            ".",
            entityify(column),
            "</address>",
            entityify(message),
            "</cite><samp>",
            entityify(line_source + "\n" + stack_trace),
            "</samp>"
        );
    });
    if (output.length === 0) {
        output.push("<center>There are no warnings.</center>");
    }
    return output.join("");
}

function function_report(data) {

// Produce the HTML Function Report.

// <dl class=LEVEL><address>LINE_NUMBER</address>FUNCTION_NAME_AND_SIGNATURE
//     <dt>DETAIL</dt><dd>NAMES</dd>
// </dl>

    let exports;
    let froms;
    let global;
    let mode = (
        data.module
        ? "module"
        : "global"
    );
    let output = [];

    if (data.json) {
        return (
            data.warnings.length === 0
            ? "<center>JSON: good.</center>"
            : "<center>JSON: bad.</center>"
        );
    }

    function detail(title, array) {
        if (Array.isArray(array) && array.length > 0) {
            output.push(
                "<dt>",
                entityify(title),
                "</dt><dd>",
                array.join(", "),
                "</dd>"
            );
        }
    }

    if (data.functions.length === 0) {
        output.push("<center>There are no functions.</center>");
    }
    global = Object.keys(data.global.context).sort();
    froms = data.froms.sort();
    exports = Object.keys(data.exports).sort();
    if (global.length + froms.length + exports.length > 0) {
        output.push("<dl class=level0>");
        detail(mode, global);
        detail("import from", froms);
        detail("export", exports);
        output.push("</dl>");
    }

    if (data.functions.length > 0) {
        data.functions.forEach(function (the_function) {
            let context = the_function.context;
            let list = Object.keys(context);
            let params;
            output.push(
                "<dl class=level",
                entityify(the_function.level),
                "><address>",
                entityify(the_function.line),
                "</address><dfn>",
                (
                    the_function.name === "=>"
                    ? entityify(the_function.signature) + " =>"
                    : (
                        typeof the_function.name === "string"
                        ? (
                            "<b>\u00ab" + entityify(the_function.name)
                            + "\u00bb</b>"
                        )
                        : "<b>" + entityify(the_function.name.id) + "</b>"
                    )
                ) + entityify(the_function.signature),
                "</dfn>"
            );
            if (Array.isArray(the_function.parameters)) {
                params = [];
                the_function.parameters.forEach(function extract(name) {
                    if (name.id === "{" || name.id === "[") {
                        name.names.forEach(extract);
                    } else {
                        if (name.id !== "ignore") {
                            params.push(name.id);
                        }
                    }
                });
                detail(
                    "parameter",
                    params.sort()
                );
            }
            list.sort();
            detail("variable", list.filter(function (id) {
                let the_variable = context[id];
                return (
                    the_variable.role === "variable"
                    && the_variable.parent === the_function
                );
            }));
            detail("exception", list.filter(function (id) {
                return context[id].role === "exception";
            }));
            detail("closure", list.filter(function (id) {
                let the_variable = context[id];
                return (
                    the_variable.closure === true
                    && the_variable.parent === the_function
                );
            }));
            detail("outer", list.filter(function (id) {
                let the_variable = context[id];
                return (
                    the_variable.parent !== the_function
                    && the_variable.parent.id !== "(global)"
                );
            }));
            detail(mode, list.filter(function (id) {
                return context[id].parent.id === "(global)";
            }));
            detail("label", list.filter(function (id) {
                return context[id].role === "label";
            }));
            output.push("</dl>");
        });
    }
    output.push(
        "<center>JSLint edition ",
        entityify(data.edition),
        "</center>"
    );
    return output.join("");
}

function property_directive(data) {

// Produce the /*property*/ directive.

    let length = 1111;
    let not_first = false;
    let output = ["/*property"];
    let properties = Object.keys(data.property);

    properties.sort().forEach(function (key) {
        if (not_first) {
            output.push(",");
            length += 2;
        }
        not_first = true;
        if (length + key.length >= 80) {
            length = 4;
            output.push("\n   ");
        }
        output.push(" ", key);
        length += key.length;
    });
    output.push("\n*/\n");
    return output.join("");
}

function clear_options() {
    elem_boxes.forEach(function (node) {
        node.checked = false;
    });
    elem_global.value = "";
}

function call_jslint() {
    let global_string;
    let option;
    let result;

// Show ui-loader-animation.

    document.querySelector("#uiLoader1").style.display = "flex";

// First build the option object.

    option = Object.create(null);
    elem_boxes.forEach(function (node) {
        if (node.checked) {
            option[node.title] = true;
        }
    });

// Call JSLint with the source text, the options, and the predefined globals.

    global_string = elem_global.value;
    result = jslint(
        editor.getValue(),
        option,
        (
            global_string === ""
            ? undefined
            : global_string.split(
                /[\s,;'"]+/
            )
        )
    );

// Debug result.

    globalThis.jslint_result = result;

// Generate the reports.
// Display the reports.

    elem_warnings_list.innerHTML = error_report(result);
    elem_report_list.innerHTML = function_report(result);
    elem_report_field.style.display = "block";
    elem_source.select();
    elem_property.value = property_directive(result);
    elem_property_fieldset.style.display = "block";
    elem_property.scrollTop = 0;

// Hide ui-loader-animation.

    setTimeout(function () {
        document.querySelector("#uiLoader1").style.display = "none";
    }, 500);
}

document.addEventListener("keydown", function (evt) {
    if (evt.ctrlKey && evt.key === "Enter") {
        call_jslint();
    }
});

document.querySelectorAll("[name='JSLint']").forEach(function (node) {
    node.onclick = call_jslint;
});

document.getElementById("JSLINT_CLEAR_OPTIONS").onclick = clear_options;

// init codemirror editor
editor = globalThis.CodeMirror.fromTextArea(document.querySelector(
    "#JSLINT_SOURCE"
), {
    extraKeys: {
        Tab: function (editor) {
            editor.replaceSelection("    ");
        }
    },
    indentUnit: 4,
    indentWithTabs: false,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    mode: "text/javascript",
    showTrailingSpace: true
});
editor.setValue(`#!/usr/bin/env node
/*jslint node*/
import jslint from \u0022./jslint.mjs\u0022;
import https from "https";

/*jslint-disable*/
// TODO: jslint this code-block in the future.
console.log('hello world');
/*jslint-enable*/

eval( //jslint-quiet
    "console.log('hello world');"
);

(async function () {
    let result;
    result = await new Promise(function (resolve) {
        https.request("https://www.jslint.com/jslint.js", function (res) {
            result = "";
            res.on("data", function (chunk) {
                result += chunk;
            }).on("end", function () {
                resolve(result);
            }).setEncoding("utf8");
        }).end();
    });
    result = jslint(result);
    result.warnings.forEach(function ({
        formatted_message
    }) {
        console.error(formatted_message);
    });
}());
`);
call_jslint();
