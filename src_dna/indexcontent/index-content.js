
//Function called by the HC app to search for a string of words and get all the objects indexed for the words.
function searchKeywords(searchString) {
  var searchArr = searchString.split(/,| |:|-/);
  var i = searchArr.length;
  var mergedList = {};
  var list = [];
  var listH = {};

  i--;

  while (i >= 0) {

    debug(searchArr[i]);
    list = call("anchor", "anchor_list", searchArr[i]);

    var temp = JSON.parse(list);
    debug(list);
    for (var m = 0; m < temp.length; m++) {
      var temp1 = JSON.parse(temp[m].Anchor_Text);
      debug(temp1.Anchor_Text);
      listH[temp1.Anchor_Text] = true;
      mergedList = union(mergedList, listH);
    }

    i--;
  }

  var jsonmer = Object.keys(mergedList);

  return jsonmer;
}

//To provide a list of all the objects that are indexed against the search string

function union(mergedList, listH) {
  var listKeys = Object.keys(listH);

  debug(listKeys);
  for (var i = 0; i < listKeys.length; i++) {
    if (mergedList[listKeys[i] == true]) {
      debug("Already added to merged !");
    } else {
      mergedList[listKeys[i]] = true;
    }
  }
  debug(mergedList);
  return mergedList;
}

//Index content function is called from a HC application by passing the content and the hash of the object so that the link cant be
//made directly to the object.
function indexContent(content, hashOfObject, language) {

  var HTIgnoreWords = getIgnoreWords(language);

  var keywords = content.split(" ");
  var i = keywords.length;

  i--;
  while (i >= 0) {

    if (HTIgnoreWords[keywords[i]] == true) {
      debug("Ignoring keyword : " + keywords[i]);
    } else {

      var exists = getkeyword(keywords[i], ""); //Checking if achor type for the keyword already exists

      if (exists.name == "HolochainError") //If not , create anchor type with the keyword and then the link to content
        {

          call("anchor", "anchor_type_create", keywords[i]);
          var IndexContentByKeyword = { Anchor_Type: keywords[i], Anchor_Text: hashOfObject };
          call("anchor", "anchor_create", IndexContentByKeyword);
          debug("Index created for - " + keywords[i]);
        } else {
        //Else, only create the anchor for content and link content(object)
        //to keyword
        debug("Inside ELSE");
        var IndexContentByKeyword = { Anchor_Type: keywords[i], Anchor_Text: hashOfObject };

        var checkexist = getkeyword(keywords[i], hashOfObject);

        if (checkexist.C != JSON.stringify(IndexContentByKeyword)) {

          call("anchor", "anchor_create", IndexContentByKeyword);
          debug("Index created for - " + keywords[i]);
        } else {
          debug("Index for the keyword for this content already exists !");
        }
      }
    }

    i--;
  }
  var lnk = call("anchor", "anchor_type_list", "");
  var strlnk = lnk.toString();
  debug("Object indexed for keywords : " + strlnk);
  return hashOfObject;
}

//Function to check existance of the anchor object
function getkeyword(keyword, hashOfObject) {
  var keywordAnchor = { Anchor_Type: keyword, Anchor_Text: hashOfObject };

  debug(keywordAnchor);
  var kahash = makeHash("anchor", keywordAnchor);

  var sources = get(kahash, { GetMask: HC.GetMask.Suorces });

  return sources;
}

