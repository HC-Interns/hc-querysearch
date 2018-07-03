
/*===========================================
=            Messaging Callbacks            =
===========================================*/

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

  debug("message received!");

  switch(msg.call) {
    case 'index':
      return index(msg.payload);
      break;
    case 'search':
      return search(msg.payload);
      break;
    default:
      return "InvalidCall";
  }
}

/*=====  End of Messaging Callbacks  ======*/

// publicly exposed message interface calls

function messageIndex({to, payload}) {
  return JSON.parse(send(to, {call : 'index', payload : payload}));
}

function messageSearch({to, payload}) {
  return JSON.parse(send(to, {call : 'search', payload : payload}));
}