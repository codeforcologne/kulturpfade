let namespace = "05315000-b03-t02";
let languageCode;

/**************************************************************************************************/
// GET LANGUAGE
/**************************************************************************************************/

let browserLanguage = navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0];
if (getURLParameter('lng')) {
    browserLanguage = getURLParameter('lng');
}
console.log("Browsersprache: ", browserLanguage);

/**************************************************************************************************/
// URL PARAMETER START
/**************************************************************************************************/

function getURLParameter(name) {
  return decodeURIComponent(
    (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)
      || [null, ''])[1].replace(/\+/g, '%20')
  ) || null;
}
