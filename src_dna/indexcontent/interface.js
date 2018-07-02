
/*========================================
=            Public Functions            =
========================================*/

function index({entryType, entryHash}) {
  // load the entry (will have to call over bridge in bridging case)
  let entry = get(entryType, entryHash);
  let entryFlat = flattenObject(entry);

  // index each of the fields that need indexing
  indexSpec[entryType].forEach(field => {
    processString(entryFlat[field]).forEach(keyword => {

      // create a new anchor if it doesn't exist already
      let keywordAnchorHash = commit('keywordAnchor' {
        entryType,
        field,
        keyword
      });

      // link this entry
      commit('keywordLinks', {
        Links: [{ Base: keywordAnchorHash, Link: entryHash, Tag: '' }]
      });

    });
  });



}

function search({entryType, queryString, options={}}) {

}

/*=====  End of Public Functions  ======*/

