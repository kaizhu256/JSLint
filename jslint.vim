function! JSLint()
    let jslint_output = system("node jslint.mjs .")
    echom jslint_output


    ""!! if exists("b:jslint_disabled") && b:jslint_disabled == 1
        ""!! return
    ""!! endif

    ""!! highlight link JSLintError SpellBad

    ""!! if exists("b:cleared")
        ""!! if b:cleared == 0
            ""!! call s:JSLintClear()
        ""!! endif
        ""!! let b:cleared = 1
    ""!! endif

    ""!! let b:matched = []
    ""!! let b:matchedlines = {}

    ""!! " Detect range
    ""!! if a:firstline == a:lastline
        ""!! " Skip a possible shebang line, e.g. for node.js script.
        ""!! if getline(1)[0:1] == "#!"
            ""!! let b:firstline = 2
        ""!! else
            ""!! let b:firstline = 1
        ""!! endif
        ""!! let b:lastline = '$'
    ""!! else
        ""!! let b:firstline = a:firstline
        ""!! let b:lastline = a:lastline
    ""!! endif

    ""!! let b:qf_list = []
    ""!! let b:qf_window_count = -1

    ""!! let lines = join(s:jslintrc + getline(b:firstline, b:lastline), "\n")
    ""!! if len(lines) == 0
        ""!! return
    ""!! endif
    ""!! if has('win32') || has('win64')
        ""!! let b:jslint_output = system(s:cmd, lines . "\n")
    ""!! else
        ""!! let old_shell = &shell
        ""!! let &shell = '/bin/bash'
        ""!! let b:jslint_output = system(s:cmd, lines . "\n")
        ""!! let &shell = old_shell
    ""!! endif
    ""!! if v:shell_error
        ""!! echoerr b:jslint_output
        ""!! echoerr 'could not invoke JSLint!'
        ""!! let b:jslint_disabled = 1
    ""!! end

    ""!! for error in split(b:jslint_output, "\n")
        ""!! " Match {line}:{char}:{message}
        ""!! let b:parts = matchlist(error, '\v(\d+):(\d+):([A-Z]+):(.*)')
        ""!! if !empty(b:parts)
            ""!! let l:line = b:parts[1] + (b:firstline - 1 - len(s:jslintrc)) " Get line relative to selection
            ""!! let l:errorMessage = b:parts[4]

            ""!! if l:line < 1
                ""!! echoerr 'error in jslintrc, line ' . b:parts[1] . ', character ' . b:parts[2] . ': ' . l:errorMessage
            ""!! else
                ""!! " Store the error for an error under the cursor
                ""!! let s:matchDict = {}
                ""!! let s:matchDict['lineNum'] = l:line
                ""!! let s:matchDict['message'] = l:errorMessage
                ""!! let b:matchedlines[l:line] = s:matchDict
                ""!! if b:parts[3] == 'ERROR'
                        ""!! let l:errorType = 'E'
                ""!! else
                        ""!! let l:errorType = 'W'
                ""!! endif
                ""!! if g:JSLintHighlightErrorLine == 1
                    ""!! let s:mID = matchadd('JSLintError', '\v%' . l:line . 'l\S.*(\S|$)')
                ""!! endif
                ""!! " Add line to match list
                ""!! call add(b:matched, s:matchDict)

                ""!! " Store the error for the quickfix window
                ""!! let l:qf_item = {}
                ""!! let l:qf_item.bufnr = bufnr('%')
                ""!! let l:qf_item.filename = expand('%')
                ""!! let l:qf_item.lnum = l:line
                ""!! let l:qf_item.text = l:errorMessage
                ""!! let l:qf_item.type = l:errorType

                ""!! " Add line to quickfix list
                ""!! call add(b:qf_list, l:qf_item)
            ""!! endif
        ""!! endif
    ""!! endfor

    ""!! if exists("s:jslint_qf")
        ""!! " if jslint quickfix window is already created, reuse it
        ""!! call s:ActivateJSLintQuickFixWindow()
        ""!! call setqflist(b:qf_list, 'r')
    ""!! else
        ""!! " one jslint quickfix window for all buffers
        ""!! call setqflist(b:qf_list, '')
        ""!! let s:jslint_qf = s:GetQuickFixStackCount()
    ""!! endif
    ""!! let b:cleared = 0




endfunction

call JSLint()
