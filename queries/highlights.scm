[
  "let"
  "lambda"
  "in"
  "if"
  "then"
  "else"
  "type"
  "case"
  "of"
] @keyword
[
  "="
  "+"
  "-"
  "*"
  "/"
  "<"
  ">"
  "<="
  ">="
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
  argument: (identifier) @parameter)

(letExpr
  name: (identifier) @function
  value: (lambda))

(letStatement
  name: (identifier) @function
  value: (lambda))

(letExpr
  type: (_) @type)

(letStatement
  type: (_) @type)

(typeStatement
  (typeName) @type)

(typeStatement
  (typeVar) @type)

(constructor
  (identifier) @function
  (_)+ @type)

(caseBody
  constructor: (_) @function
  captures: (_))
