package tree_sitter_imp_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_imp "github.com/enmiligi/tree-sitter-imp/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_imp.Language())
	if language == nil {
		t.Errorf("Error loading Imp grammar")
	}
}
