//This is the list of common words(stop words) which do not need to Indexed for search. This list needs to be enhanced to cover all
//possible ignore words
function getIgnoreWords(language) {
  var IWreturn = {};
  debug("Entered IW return function !");
  IWreturn = loadIW(language);

  return IWreturn;
}

function loadIW(language) {
  debug("Inside load IW !");
  var ignoreList = loadignoreWords(language);
  debug("Value of variable ignoreList is : " + ignoreList);
  var ignoreListarr = ignoreList.split(" ");
  var IgnoreWords = {};

  for (var i = 0; i < ignoreListarr.length; i++) {
    IgnoreWords[ignoreListarr[i]] = true;
  }
  return IgnoreWords;
}

function loadignoreWords(language) {

  if (language == "English") ignoreList = "this This the is a an are and to be we : -";else if (language == "Hindi") ignoreList = "ये हिंदी उपेक्षा शब्द हैं";else if (language == German) ignoreList = "Diese sind Deutsch ignorieren Worte";else if (language == Japanese) ignoreList = "これらは日本語を無視する";

  return ignoreList;
}
