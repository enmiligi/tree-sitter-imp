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
      seq(
        optional($._statement),
        repeat(seq($._newStatement, optional($._statement))),
      ),

    _statement: ($) => choice($.letStatement),

    letStatement: ($) =>
      seq("let", field("name", $.identifier), "=", field("value", $._expr)),

    _expr: ($) =>
      choice(
        $.identifier,
        $.intLiteral,
        $.floatLiteral,
        $.charLiteral,
        $.stringLiteral,
        $.call,
        $._parenExpr,
        $.letExpr,
        $.lambda,
        $.if,
        $.list,
        $.not,
        $.add,
        $.subtract,
        $.multiply,
        $.divide,
        $.lessThan,
        $.moreThan,
        $.equals,
        $.notEquals,
        $.seq,
      ),

    not: ($) => seq("!", $._expr),

    add: ($) => prec.left(20, seq($._expr, "+", $._expr)),
    subtract: ($) => prec.left(20, seq($._expr, "-", $._expr)),
    multiply: ($) => prec.left(30, seq($._expr, "*", $._expr)),
    divide: ($) => prec.left(30, seq($._expr, "/", $._expr)),

    lessThan: ($) => prec.left(10, seq($._expr, "<", $._expr)),
    moreThan: ($) => prec.left(10, seq($._expr, ">", $._expr)),
    equals: ($) => prec.left(10, seq($._expr, "==", $._expr)),
    notEquals: ($) => prec.left(10, seq($._expr, "!=", $._expr)),

    seq: ($) => prec.left(5, seq($._expr, ";", $._expr)),

    call: ($) => prec.left(100, seq($._expr, $._expr)),

    _parenExpr: ($) => seq("(", $._expr, ")"),

    letExpr: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        "=",
        field("value", $._expr),
        "in",
        field("result", $._expr),
      ),

    lambda: ($) =>
      seq(
        "lambda",
        field("argument", $.identifier),
        ".",
        field("body", $._expr),
      ),

    if: ($) =>
      seq(
        "if",
        field("predicate", $._expr),
        "then",
        field("then", $._expr),
        "else",
        field("else", $._expr),
      ),

    list: ($) =>
      seq(
        "[",
        optional(seq($._expr, repeat(seq(",", $._expr)), optional(","))),
        "]",
      ),

    boolLiteral: ($) => choice("True", "False"),

    intLiteral: ($) => token(/\d+/),
    floatLiteral: ($) => token(/\d+\.\d*/),

    charLiteral: ($) => seq("'", $._char, "'"),
    stringLiteral: ($) => seq('"', repeat($._char), '"'),

    _char: ($) => /[^\\]|\\(n|r|t|'|"|\\)/,

    identifier: ($) => token(/[A-Za-z]\w*/),

    _SPACE: ($) => token(/([\t\f\v ]+|(\n|\r|\r\n)[\t\f\v ]+)/),

    _newStatement: ($) => token("\n"),
  },
});
