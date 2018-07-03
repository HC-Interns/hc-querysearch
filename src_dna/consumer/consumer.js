
function addRecord(record) {
  return commit('record', record);
}

function addRecordAndIndex(record) {
  let hash = commit('record', record);
  call("holodex", "index", {entryType: 'record', entryHash: hash});
  return hash;
}