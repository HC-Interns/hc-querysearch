
/*========================================
=            Public Functions            =
========================================*/

function index({entryType, entryHash}) {
  // load the entry (will have to call over bridge in bridging case)
  debug(entryType)
  debug(entryHash)

  let entry = get(entryHash);
  let entryFlat = flattenObject(entry);

  debug(entry);

  // index each of the fields that need indexing
  indexSpec[entryType].indexFields.forEach(({fieldName, weight}) => {
    processString(entryFlat[fieldName]).forEach(keyword => {

      // create a new anchor if it doesn't exist already
      let keywordAnchorHash = commit('keywordAnchor', {
        entryType,
        fieldName,
        keyword
      });

      // link this entry
      commit('keywordLinks', {
        Links: [{ Base: keywordAnchorHash, Link: entryHash, Tag: '' }]
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
      let keywordAnchorHash =  ('keywordAnchor', {entryType, fieldName, keyword});
      getLinks(keywordAnchorHash).forEach(({Hash}) => {
        // add a new result entry or increment the weight
        if(results[Hash]) {
          result[Hash] += weight;
        } else {
          result[Hash] = weight;
        }
      });
    });
  });

  return results;

}

/*=====  End of Public Functions  ======*/

