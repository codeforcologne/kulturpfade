var language;

var namespace = [
    'navigation',
    'attribution'
    ];

document.addEventListener('DOMContentLoaded', function() {
  if (typeof i18next !== 'undefined' && typeof i18nextHttpBackend !== 'undefined') {
    i18next
      .use(i18nextHttpBackend)
      .use(window.i18nextBrowserLanguageDetector)
      .init({
        fallbackLng: 'en',
        debug: true,
        i18nextHttpBackend: {
           loadPath: 'locales/{{lng}}/{{ns}}.json', // Beispiel-Pfad für Übersetzungsdateien
        },
        ns: namespace
      }, function(err, t) {
        // call update content
        updateContent()
      })
      .then(() => {
        console.log('i18next initialized!');
      })
      .catch((err) => {
        console.error('Error initializing i18next:', err);
      });
  } else {
    console.error('i18next wurde nicht geladen!');
  }
});

function updateContent() {
    document.title = i18next.t('title');
    document.getElementById('brand').innerHTML = i18next.t('navigation:title');
    document.getElementById('closeBtn').innerHTML = i18next.t('navigation:closeBtn');
}


function getLanguage() {

  var shortLng;
// wenn keine sprache gesetzt ist, ermittle die Browser-Sprache
  if (typeof language !== 'undefined') {
    this.language = navigator.language || navigator.userLanguage;
    shortLng = language.split(/[-_]/)[0];
  }
// Extrahiere die erste Zeichenkette vor dem Bindestrich oder Unterstrich
  if (config.languages.includes(shortLng)) {
    return shortLng;
  } else {
    return config.defaultLanguage;
  }
}

function changeLanguage(language) {
    this.language = language;
}



class LanguageSelector {

    buildLanguageSelector(language) {
        var newLi, targetElement;
        newLi = document.createElement('li');
        newLi.innerHTML = '&nbsp;&nbsp;<i class="fa fa-download"></i>&nbsp;&nbsp;<span>' + language + '</span>';
        targetElement = document.getElementById('languageDropdownUl');
        targetElement.appendChild(newLi);
    }

}

