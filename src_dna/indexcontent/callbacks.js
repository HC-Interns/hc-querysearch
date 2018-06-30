function genesis() {
  return true;
}

function validatePut(entry_type, entry, header, pkg, sources) {
  //
  return validateCommit(entry_type, entry, header, pkg, sources);
}
function validateCommit(entry_type, entry, header, pkg, sources) {
  //
  if (entry_type == 'anchor') {
    return true;
  }
  if (entry_type == 'anchor_link') {
    return true;
  }
  return false;
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