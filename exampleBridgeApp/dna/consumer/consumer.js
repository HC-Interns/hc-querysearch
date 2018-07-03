
'use strict';

function addRecord(record) {
  return commit('record', record);
}



/*===================================
=            Holodex API            =
===================================*/


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


// publicly exposed message interface calls

function messageIndex(params) {
  debug('message index called');
  var to = params.to,
      payload = params.payload;

  return JSON.parse(send(to, { call: 'index', payload: payload }));
}

function messageSearch(params) {
  var to = params.to,
      payload = params.payload;
  return JSON.parse(send(to, { call: 'search', payload: payload }));
}

/**
 * receive - Callback for handling direct messages. Used as the main interface between consumer nodes and indexer nodes
 *
 * @param      {hash-string}  from - The key hash of the sender
 * @param      {Object}  msg - The message object
 * @param      {string} msg.call - The function to call. must be one of 'index', 'search'
 * @param      {Object} msg.payload - Object to pass to the function call
 * @return     {Object}  - Returns result of call if valid or an error string
 */
function receive(from, msg) {
  debug('message received');
  debug(JSON.stringify(msg));

  switch(msg.call) {
    case 'index':
      return bridgeIndex(msg.payload);
      break;
    case 'search':
      return bridgeSearch(msg.payload);
      break;
    default:
      return "InvalidCall";
  }
}


/*=====  End of Holodex API  ======*/




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
