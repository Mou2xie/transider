document.addEventListener('dblclick', (e) => {

  let selectedText = window.getSelection().toString().trim().toLowerCase();

  if (isEnglishString(selectedText)) {
    let { target: { textContent } } = e;
    let sentence = findRelatedSentence(selectedText, textContent.split('.'));
    let currentURL = window.location.href;

    chrome.runtime.sendMessage({
      selectedText,
      sentence,
      currentURL,
      from:1 // open sidepanel from websites
    });
  }
});

//find which sentence the selected word is in.
function findRelatedSentence(selectedText, sentences) {
  let sentence = undefined;
  const matches = sentences.filter((item) => new RegExp('\\b' + selectedText + '\\b', 'i').test(item));
  if (matches.length > 0) {
    sentence = matches[0] + '.';
    sentence = sentence.replace(new RegExp('\\b' + selectedText + '\\b', 'gi'), `<span>${selectedText}</span>`)
  }
  return sentence
}

//if the selected word is in english or empty.
function isEnglishString(selectedText) {
  let englishRegex = /^[a-zA-Z]+$/;
  return englishRegex.test(selectedText);
}
