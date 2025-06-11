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

    _statement: ($) => choice($.letStatement, $.typeStatement),

    letStatement: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        optional(seq(":", field("type", $._constrainedType))),
        "=",
        field("value", $._expr),
      ),

    typeStatement: ($) =>
      seq(
        "type",
        $.typeName,
        repeat($.typeVar),
        "=",
        $.constructor,
        repeat(seq("|", $.constructor)),
      ),

    constructor: ($) =>
      prec(
        100,
        seq(
          $.identifier,
          repeat(
            choice($._bracketedType, $.typeVar, $.typeName, $.builtinType),
          ),
        ),
      ),

    _expr: ($) =>
      choice(
        $.identifier,
        $.intLiteral,
        $.floatLiteral,
        $.boolLiteral,
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
        $.case,
        $.or,
        $.and,
      ),

    not: ($) => seq("!", $._expr),

    seq: ($) => prec.left(10, seq($._expr, ";", $._expr)),

    or: ($) => prec.left(20, seq($._expr, "or", $._expr)),
    and: ($) => prec.left(30, seq($._expr, "and", $._expr)),

    lessThan: ($) => prec.left(40, seq($._expr, "<", $._expr)),
    moreThan: ($) => prec.left(40, seq($._expr, ">", $._expr)),
    equals: ($) => prec.left(40, seq($._expr, "==", $._expr)),
    notEquals: ($) => prec.left(40, seq($._expr, "!=", $._expr)),

    add: ($) => prec.left(50, seq($._expr, "+", $._expr)),
    subtract: ($) => prec.left(50, seq($._expr, "-", $._expr)),
    multiply: ($) => prec.left(60, seq($._expr, "*", $._expr)),
    divide: ($) => prec.left(60, seq($._expr, "/", $._expr)),

    call: ($) => prec.left(100, seq($._expr, $._expr)),

    _parenExpr: ($) => seq("(", $._expr, ")"),

    letExpr: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        optional(seq(":", field("type", $._constrainedType))),
        "=",
        field("value", $._expr),
        "in",
        field("result", $._expr),
      ),

    lambda: ($) =>
      seq(
        "lambda",
        field("argument", $.identifier),
        optional(seq(":", field("type", $._constrainedType))),
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

    case: ($) =>
      prec.right(
        seq(
          "case",
          field("value", $._expr),
          "of",
          $.caseBody,
          repeat(seq("|", $.caseBody)),
        ),
      ),
    caseBody: ($) =>
      seq(
        field("constructor", $.identifier),
        field("captures", repeat($.identifier)),
        "=>",
        $._expr,
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

    charLiteral: ($) => seq("'", $.char, "'"),
    stringLiteral: ($) => seq('"', repeat($.char), '"'),

    escapeSequence: ($) => /\\(n|r|t|'|"|\\)/,
    char: ($) => choice(/[^\\]/, $.escapeSequence),

    identifier: ($) => token(/[A-Za-z]\w*/),

    _constrainedType: ($) => choice($._type, $.constraints),

    constraints: ($) =>
      seq(
        $.constraint,
        repeat(seq(",", $.constraint)),
        optional(","),
        "=>",
        $._type,
      ),
    constraint: ($) => seq("Number", $.typeVar),

    _type: ($) =>
      choice(
        $.builtinType,
        $.constructed,
        $.functionType,
        $.typeVar,
        $.typeName,
        $._bracketedType,
      ),

    _bracketedType: ($) => seq("(", $._type, ")"),

    typeVar: ($) => token(/[a-z]\w*/),
    typeName: ($) => token(/[A-Z]\w*/),
    builtinType: ($) => choice("Int", "Float", "Char", "Bool"),
    constructed: ($) =>
      prec.left(100, seq(choice($.constructed, $.typeName), $._type)),
    functionType: ($) => prec.right(seq($._type, "->", $._type)),

    _SPACE: ($) => token(/([\t\f\v ]+|(\n|\r|\r\n)+[\t\f\v ]+)/),

    _newStatement: ($) => token("\n"),
  },
});
