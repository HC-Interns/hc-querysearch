
'use strict';

function addRecord(record) {
  return commit('record', record);
}



// functions to expose using bridging to HoloDex
function bridgeIndex(payload) {
  debug(getBridges()[0].CalleeApp);
  debug(payload);
  return bridge(
    getBridges()[0].CalleeApp,
    "holodex",
    "index",
    payload
  );
}

function bridgeSearch(payload) {
  return bridge(
    getBridges()[0].CalleeApp,
    "holodex",
    "search",
    payload
  );
}


/*=================================
=            Callbacks            =
=================================*/

function bridgeGenesis(side, dna, appData) {
  debug(App.Name + ' Bridged to: DNA: ' + dna);
  return true;
}


function genesis() {
  return true;
}

function validatePut(entry_type, entry, header, pkg, sources) {
  return true;
}
function validateCommit(entry_type, entry, header, pkg, sources) {
  return true;
}

function validateLink(linkingEntryType, baseHash, linkHash, pkg, sources) {
  //
  return true;
}
function validateMod(entry_type, hash, newHash, pkg, sources) {
  //
  return true;
}
function validateDel(entry_type, hash, pkg, sources) {
  //
  return true;
}
function validatePutPkg(entry_type) {
  //
  return null;
}
function validateModPkg(entry_type) {
  //
  return null;
}
function validateDelPkg(entry_type) {
  //
  return null;
}
function validateLinkPkg(entry_type) {
  //
  return null;
}

/*=====  End of Callbacks  ======*/
