/*=========================================
=            String Processing            =
=========================================*/
// functions related to convering a string to a 
// series of tokens for indexing or querying

function tidy(str) {
  return JSON.stringify(str).replace(/[^\w\s]/gi, '').trim().toLowerCase();
}


function tokenize(str) {
  // this will do for now but actually should be much smarter
  return str.split(/[ ]+/);
}


function removeStopWords(tokens) {
  // return the set of tokens without stopwords
  // keeping it super simple for now but need to add support for multi-language and
  // app author configuration
  let stopwords = ['the', 'is'];

  return tokens.filter(x => !(stopwords.indexOf(x) > -1));
}


function stem(tokens) {
  return tokens; //passthrough until a stemming framework can be found
}


const pipeline = [tidy, tokenize, removeStopWords, stem];

// call process in a string to return a set containing the index tokens
const processString = (str) => pipeline.reduce((val, fn) => fn(val), str);


/*=====  End of String Processing  ======*/

// export for unit testing in node

if(typeof module !== 'undefined') {
  module.exports = {
    tidy: tidy,
    tokenize: tokenize,
    removeStopWords: removeStopWords,
    stem: stem,
    processString: processString
  };
}
