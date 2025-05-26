/**
 * @file Parser for the Imp language made for my matura project
 * @author Enea Giger
 * @license GPLv3
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "imp",

  extras: ($) => [$._SPACE],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) =>
      seq(optional($._expr), repeat(seq($._newStatement, optional($._expr)))),

    _expr: ($) =>
      choice(
        $.identifier,
        $.intLiteral,
        $.floatLiteral,
        $.charLiteral,
        $.stringLiteral,
        $.call,
      ),

    call: ($) => prec.left(seq($._expr, $._expr)),

    intLiteral: ($) => token(/\d+/),
    floatLiteral: ($) => token(/\d+\.\d*/),

    charLiteral: ($) => seq("'", $.char, "'"),
    stringLiteral: ($) => seq('"', repeat($.char), '"'),

    _char: ($) => /[^\\]|\\(n|r|t|'|"|\\)/,

    identifier: ($) => token(/[A-Za-z]\w*/),

    _SPACE: ($) => token(/(\s+|\s*\n[\r\t\f\v ]+)/),

    _newStatement: ($) => token("\n"),
  },
});
