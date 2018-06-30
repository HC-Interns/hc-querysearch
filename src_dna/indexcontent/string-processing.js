/*=========================================
=            String Processing            =
=========================================*/
// function relate to convering a string to a 
// series of tokens for indexing or querying

function tidy(str) {

}

function tokenize(str) {
  var tokens = new Set([]);

  // do some magic

  return tokens;
}

function removeStopWords(tokens) {
  return tokens;
}

function stem(tokens) {

}


const pipeline = [tidy, tokenize, removeStopWords, stem];

// call process in a string to return a set containing the index tokens
const process = (str) => pipeline.reduce((val, fn) => fn(val), str);


/*=====  End of String Processing  ======*/
