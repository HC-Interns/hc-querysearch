const sp = require('../src_dna/indexcontent/string-processing'),
      test = require('tape')

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


