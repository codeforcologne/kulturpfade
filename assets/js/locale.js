// Sprache des Browsers ermitteln

document.addEventListener('DOMContentLoaded', function() {
  if (typeof i18next !== 'undefined' && typeof i18nextHttpBackend !== 'undefined') {
    i18next
      .use(i18nextHttpBackend)
      .use(window.i18nextBrowserLanguageDetector)
      .init({
        lng: browserLanguage,
        fallbackLng: 'de',
        debug: true,
        i18nextHttpBackend: {
           loadPath: './locales/{{ns}}/{{lng}}/properties.json', //path has to be defined in 'assets/i18next/i18nextHttpBackend.js'; checkout readme.txt
        },
        ns: namespace
      }, function(err, t) {
        languageCode = i18next.language.split('-')[0];
        // call update content
        updateContent();
      })
      .then(() => {
        console.log('i18next initialized');
      })
      .catch((err) => {
        console.error('Error initializing i18next:', err);
      });
  } else {
    console.error('i18next wurde nicht geladen!');
  }
});

function updateContent() {

    let languages = i18next.t('languages', { returnObjects: true });
    let languageSelector = new LanguageSelector();
    for (let i = 0; i < languages.length; i++) {
        languageSelector.build(languages[i], i18next.language);
    }

    loadPoiLayer();

    document.title = i18next.t('title');
    document.getElementById('brand').innerHTML = i18next.t('brand');
    document.getElementById('routeModal').innerHTML = i18next.t('brand');
    document.getElementById('closeBtnAboutModal').innerHTML = i18next.t('closeBtn');
    document.getElementById('closeBtnLegendModal').innerHTML = i18next.t('closeBtn');
    document.getElementById('closeBtnFeatureModel').innerHTML = i18next.t('closeBtn');
    document.getElementById('languageSelectorA').innerHTML = i18next.t('language');
    document.getElementById('zoomSelectorSpan').innerHTML = i18next.t('zoom');
    document.getElementById('routeSelectorSpan').innerHTML = i18next.t('route');
    document.getElementById('poisSelectorSpan').innerHTML = i18next.t('pois');
    document.getElementById('downloadSelectorSpan').innerHTML = i18next.t('download');
    document.getElementById('poisPanelTitle').innerHTML = i18next.t('pois');
    document.getElementById('welcomeModelTitle').innerHTML = i18next.t('welcomeModelTitle');

    new ModalBuilder().build('aboutTabsHeader', i18next.language);
    new ModalBuilder().build('attributionModal', i18next.language);
    new ModalBuilder().build('disclaimerModal', i18next.language);
    new ModalBuilder().build('featuresModal', i18next.language);
    new ModalBuilder().build('routModalBody', i18next.language);
    new ModalBuilder().build('links', i18next.language);
    new ModalBuilder().build('expectModal', i18next.language);
    new ModalBuilder().build('aboutModal', i18next.language);
}

/**
Use this class to buildLanguageSelector
*/
class LanguageSelector {

    constructor() {
        // remove languageSelectorUl innerHTML before setting new
        document.getElementById('languageSelectorUl').innerHTML = '';
    }

    /**
    * need actual language to change behavior of li-tag,
    * don't allow onclick, if language is already chosen.
    */
    build(newLanguage, existingLanguage) {

        var newLi, targetElement, lng;
        lng = i18next.t(newLanguage);
        newLi = document.createElement('li');
        if (newLanguage === existingLanguage) {
          newLi.innerHTML = '<a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="changeLanguage(\'' + newLanguage + '\')"><i class="bi bi-translate"></i>&nbsp;&nbsp;<i>' + lng + '</i></a>';
        } else {
          newLi.innerHTML = '<a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="changeLanguage(\'' + newLanguage + '\')"><i class="bi bi-translate"></i>&nbsp;&nbsp;' + lng + '</a>';
        }
        targetElement = document.getElementById('languageSelectorUl');
        targetElement.appendChild(newLi);
    }

}

// Funktion zur Sprachumschaltung
function changeLanguage(language) {
    i18next.changeLanguage(language, (err, t) => {
        if (err) {
            return console.error('Error changing language:', err);
        }
        languageCode = i18next.language;
        updateContent();
//        console.log('Sprache geändert auf:', languageCode);
    });
}
