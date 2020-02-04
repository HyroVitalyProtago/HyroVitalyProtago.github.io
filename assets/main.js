const html = document.documentElement;

// https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
/*function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}*/

html.ontransitionend = function() {
  html.removeAttribute('theme-transition');
}

function setTheme(theme, transition = true) {
  if (transition) {
    html.setAttribute('theme-transition', true);
    /*document.querySelectorAll('body *').forEach(e => {
      if (checkVisible(e)) {
        e.setAttribute('transition-visible', true);
      }
    });*/
  }
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

const userTheme = localStorage.getItem('theme');
if (userTheme) setTheme(userTheme, false);

// used to change the language of a post
function changeLanguage(entryId) {
  const entry = document.getElementById(entryId);
  entry.setAttribute('lang', (entry.getAttribute('lang') || 'fr') == 'fr' ? 'en' : 'fr');
  const flag = entry.querySelector('.change-language');
  flag.textContent = entry.getAttribute('lang') == 'en' ? "🇫🇷" : "🇬🇧";
}

// @todo tiny message in aside to propose the right language based on navigator.language ?