#include "tree_sitter/alloc.h"
#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"
#include <stdbool.h>

enum TokenType { ESCAPECHAR, STRINGCHAR, CHAR, COMMENT, ERROR };

void *tree_sitter_imp_external_scanner_create() { return 0; }

void tree_sitter_imp_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_imp_external_scanner_serialize(void *payload,
                                                    char *buffer) {
  return 0;
}

void tree_sitter_imp_external_scanner_deserialize(void *payload,
                                                  const char *buffer,
                                                  unsigned length) {}

bool tree_sitter_imp_external_scanner_scan(void *payload, TSLexer *lexer,
                                           const bool *valid_symbols) {
  if (valid_symbols[ERROR]) {
    return false;
  }
  if (valid_symbols[STRINGCHAR] && lexer->lookahead != '"' &&
      lexer->lookahead != '\\') {
    lexer->advance(lexer, false);
    lexer->result_symbol = STRINGCHAR;
    return true;
  } else if (valid_symbols[CHAR]) {
    lexer->advance(lexer, false);
    lexer->result_symbol = CHAR;
    return true;
  } else if (valid_symbols[ESCAPECHAR] && lexer->lookahead == '\\') {
    lexer->advance(lexer, false);
    switch (lexer->lookahead) {
    case 'n':
    case 'r':
    case 't':
    case '\'':
    case '"':
    case '\\':
      lexer->advance(lexer, false);
      lexer->result_symbol = ESCAPECHAR;
      return true;
    default:
      return false;
    }
  } else if (valid_symbols[COMMENT] && lexer->lookahead == '#') {
    lexer->advance(lexer, false);
    while (lexer->lookahead != '\n' && lexer->lookahead != '\r')
      lexer->advance(lexer, false);
    lexer->result_symbol = COMMENT;
    return true;
  }
  return false;
}
