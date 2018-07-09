import { Stemmer } from './english-stemmer'
import { stopwords } from './stopwords'

/* =========================================
=            String Processing            =
========================================= */
'use strict'

// functions related to convering a string to a
// series of tokens for indexing or querying

function tidy (str) {
  return JSON.stringify(str).replace(/[^\w\s]/gi, '').trim().toLowerCase()
}

function tokenize (str) {
  // this will do for now but actually should be much smarter
  return str.split(/[ ]+/)
}

function stem (tokens) {
  let stemmer = new Stemmer()
  return tokens.map(word => stemmer.stemWord(word))
}

function removeStopWords (tokens) {
  // return the set of tokens without stopwords
  // keeping it super simple for now but need to add support for multi-language and
  // app author configuration
  return tokens.filter(x => !(stopwords.indexOf(x) > -1))
}

const pipeline = [tidy, tokenize, stem, removeStopWords]

// call process in a string to return a set containing the index tokens
export const processString = (str) => pipeline.reduce((val, fn) => fn(val), str)

/* =====  End of String Processing  ====== */

// export for unit testing in node

if (typeof module !== 'undefined') {
  module.exports = {
    tidy: tidy,
    tokenize: tokenize,
    removeStopWords: removeStopWords,
    stem: stem,
    processString: processString
  }
}
