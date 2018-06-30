'use strict';

function anchor(anchor) {
  var anchorType = { anchorType: anchor.anchorType, anchorText: '' };
  var rootAnchortype = { anchorType: 'anchorTypes', anchorText: '' };
  var anchorHash = makeHash('anchor', anchor);
  var anchorGet = get(anchorHash);

  if (anchorGet === null) {
    var anchorType = { anchorType: anchor.anchorType, anchorText: '' };
    var rootAnchortype = { anchorType: 'anchorTypes', anchorText: '' };
    var anchorTypeGet = get(makeHash('anchor', anchorType));

    if (anchorTypeGet === null) {
      var rootAnchorTypeHash = makeHash('anchor', rootAnchortype);

      if (get(rootAnchorTypeHash) === null) {
        rootAnchorTypeHash = commit('anchor', rootAnchortype);
      }

      var anchorTypeHash = commit('anchor', anchorType);
      commit('anchor_link', { Links: [{ Base: rootAnchorTypeHash, Link: anchorTypeHash, Tag: anchorType.anchorType }] });
    } else {
      anchorTypeHash = makeHash('anchor', anchorType);
    }
    anchorHash = commit('anchor', anchor);
    commit('anchor_link', { Links: [{ Base: anchorTypeHash, Link: anchorHash, Tag: anchor.anchorText }] });
  }

  return anchorHash;
}

function exists(anchor) {
  var key = get(makeHash('anchor', anchor));
  if (key !== null) {
    return true;
  }
  return false;
}

function anchors(type) {
  var links = getLinks(makeHash('anchor', { anchorType: type, anchorText: '' }), '');
  return links;
}

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
