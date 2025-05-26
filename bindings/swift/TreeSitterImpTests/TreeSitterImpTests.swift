import XCTest
import SwiftTreeSitter
import TreeSitterImp

final class TreeSitterImpTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_imp())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Imp grammar")
    }
}
