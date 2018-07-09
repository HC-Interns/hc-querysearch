function flattenObject(ob) {
  var toReturn = {};
  
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    
    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}


function hashExists(hash) {
  try {
    get(hash)
    return true
  } catch (err) {
    return false
  }
}

function textSearchSpec() {
  return JSON.parse(property("textSearchSpec"))
}

function indexSpec() {
  return JSON.parse(property("indexSpec"))
}