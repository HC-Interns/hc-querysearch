
/*========================================
=            Public Functions            =
========================================*/

function index({entryType, entryHash, entry=get(entryHash)}) {
  // load the entry (will have to call over bridge in bridging case)

  let entryFlat = flattenObject(entry);

  // index each of the fields that need indexing
  indexSpec[entryType].indexFields.forEach(({fieldName, weight}) => {

    debug("Extracted Keywords:" + JSON.stringify(processString(entryFlat[fieldName])));

    processString(entryFlat[fieldName]).forEach(keyword => {

      debug("linking to: "+keyword);

      // create a new anchor if it doesn't exist already
      let keywordAnchorHash = commit('keywordAnchor', {
        sourceEntryHash: entryHash,
        keyword : entryType + ":" + fieldName + ":" + keyword
      });

    });
  });

  return true;
}



function search({entryType, queryString, options={}}) {
  // results is a dictionary mapping hashes to ranks
  let results = {};

  processString(queryString).forEach(keyword => {
    indexSpec[entryType].indexFields.forEach(({fieldName, weight}) => {
      let keywordAnchorHash =  makeHash('keywordAnchor', {entryType, fieldName, keyword});
      if (hashExists(keywordAnchorHash)) {
        getLinks(keywordAnchorHash, '').forEach(({Hash}) => {
          // add a new result entry or increment the weight
          if(results[Hash]) {
            results[Hash] += weight;
          } else {
            results[Hash] = weight;
          }
        });
      }
    });
  });

  return results;

}

/*=====  End of Public Functions  ======*/

