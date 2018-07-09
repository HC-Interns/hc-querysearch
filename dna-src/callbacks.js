/*=================================
=            Callbacks            =
=================================*/


export function genesis() {
  return true;
}

export function validatePut(entry_type, entry, header, pkg, sources) {
  return true;
}
export function validateCommit(entry_type, entry, header, pkg, sources) {
  return true;
}

export function validateLink(linkingEntryType, baseHash, linkHash, pkg, sources) {
  //
  return true;
}
export function validateMod(entry_type, hash, newHash, pkg, sources) {
  //
  return true;
}
export function validateDel(entry_type, hash, pkg, sources) {
  //
  return true;
}
export function validatePutPkg(entry_type) {
  //
  return null;
}
export function validateModPkg(entry_type) {
  //
  return null;
}
export function validateDelPkg(entry_type) {
  //
  return null;
}
export function validateLinkPkg(entry_type) {
  //
  return null;
}

/*=====  End of Callbacks  ======*/
