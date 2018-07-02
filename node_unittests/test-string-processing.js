const sp = require('../src_dna/indexcontent/string-processing'),
      test = require('tape')

// tests for tidy

test('tidy removes leadind and trailing whitespace', function (t) {
    let o = sp.tidy("    test words    ");
    t.equal(o, "test words");
    t.end()
});

test('tidy converts all chars to lower case', function (t) {
    let o = sp.tidy("Test Words");
    t.equal(o, "test words");
    t.end()
});

test('tidy removes non-alphanumeric symbols', function (t) {
    let o = sp.tidy("@!!.;'#$%^&*()test words#.'#\"$%^&*()");
    t.equal(o, "test words");
    t.end()
});

// tests for tokenize

test('tokenize can split words delimited by a single space', function (t) {
    let o = sp.tokenize("these are test words");
    t.deepEqual(o, new Set(["these", "are", "test", "words"]));
    t.end()
});

test('tokenize can split words delimited with multiple spaces', function (t) {
    let o = sp.tokenize("these         are test words");
    t.deepEqual([...o], ["these", "are", "test", "words"]);
    t.end()
});

// tests for removeStopWords

// tests for stem (not yet implemented)

// tests for entire pipeline (processString)

