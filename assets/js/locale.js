let languageCode = 'de';
// define global variable
let language;

var namespace = [
    config.namespace
    ];

document.addEventListener('DOMContentLoaded', function() {
  if (typeof i18next !== 'undefined' && typeof i18nextHttpBackend !== 'undefined') {
    i18next
      .use(i18nextHttpBackend)
      .init({
        lng: 'de',
        fallbackLng: 'de',
        debug: true,
        i18nextHttpBackend: {
           loadPath: './locales/{{lng}}/{{ns}}.json',
        },
        ns: namespace
      }, function(err, t) {
        // call update content
        languageCode = i18next.language.split('-')[0];
        // languageCode = i18next.language;
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
    document.title = i18next.t('title');
    document.getElementById('brand').innerHTML = i18next.t('brand');
    document.getElementById('closeBtnAboutModal').innerHTML = i18next.t('closeBtn');
    document.getElementById('closeBtnLegendModal').innerHTML = i18next.t('closeBtn');
    document.getElementById('closeBtnFeatureModel').innerHTML = i18next.t('closeBtn');
    document.getElementById('languageSelectorA').innerHTML = i18next.t('language');
    document.getElementById('welcomeModelTitle').innerHTML = i18next.t('welcomeModelTitle');
    loadPoiLayer();
    // remove languageSelectorUl innerHTML before setting new
    document.getElementById('languageSelectorUl').innerHTML = '';
    new LanguageSelector('de').build(i18next.language);
    new LanguageSelector('en').build(i18next.language);
    new AttributionModal().build();
    new DisclaimerModal().build();
    new AboutModal().build();
}

/**
Use this class to buildLanguageSelector
*/
class LanguageSelector {

    constructor(language) {
        this.language = language;
    }

    /**
        need actual language to change behavior of li-tag,
        don't allow onclick, if language is already chosen.
    */
    build(language) {
        var newLi, targetElement, lng;
        lng = i18next.t(this.language);
        newLi = document.createElement('li');
        if (this.language === language) {
          newLi.innerHTML = '<li>&nbsp;&nbsp;<i class="fa fa-language"></i>&nbsp;&nbsp;' + lng + '</li>';
        } else {
          newLi.innerHTML = '<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" onclick="changeLanguage(\'' + this.language + '\')">&nbsp;&nbsp;<i class="fa fa-language"></i>&nbsp;&nbsp;' + lng + '</a></li>';
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
