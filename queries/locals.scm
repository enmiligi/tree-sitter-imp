(source_file) @local.scope

(letStatement
  name: (identifier) @definition)

(letExpr
  name: (identifier) @local.definition) @local.scope

(lambda
  argument: (identifier) @local.definition) @local.scope

(identifier) @local.reference
