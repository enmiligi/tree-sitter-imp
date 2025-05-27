[
  "let"
  "lambda"
  "in"
  "if"
  "then"
  "else"
] @keyword
[
  "="
  "+"
  "-"
  "*"
  "/"
  "<"
  ">"
  "!"
  "=="
  "!="
] @operator
[
  "("
  ")"
  "["
  "]"
] @punctuation.bracket
[
  ";"
  "."
] @punctuation.delimiter
(boolLiteral) @constant.builtin
[
  (intLiteral)
  (floatLiteral)
] @number
[
  (charLiteral)
  (stringLiteral)
] @string
(identifier) @variable
(lambda
  argument: (identifier) @variable.parameter)

(letExpr
  name: (identifier) @function
  value: (lambda))

(letStatement
  name: (identifier) @function
  value: (lambda))
