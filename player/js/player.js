var source = document.getElementById("source").innerHTML.trim();

var phrases = source.split("\n");
var audioLinks = [];
var currentPhrase = 0;
var delayBetweenPhrases = 1000;
phrases = phrases.map(elem => {
  var phraseArray = elem.trim().split("\t");
  var [phrase, translation, audioLink] = phraseArray;
  audioLinks.push(audioLink);
  return { phrase, translation };
});

var audios = audioLinks.map(audioLink => {
  return new Audio("audios/" + audioLink);
});

var phraseDisplay = document.getElementById("phraseDisplay");
var translationDisplay = document.getElementById("translationDisplay");

// event listeners
audios.forEach(audio => {
  audio.onended = onAudioEnded;
});
audios.forEach(audio => {
  audio.onplaying = onAudioStarted;
});

function onAudioEnded() {
  currentPhrase++;
  if (audios[currentPhrase]) {
    setTimeout(() => audios[currentPhrase].play(), delayBetweenPhrases);
  } else {
    updateDisplay("", "");
    currentPhrase = 0
  }
}

function onAudioStarted() {
  var { phrase, translation } = getCurrentPhrase();
  updateDisplay(phrase, translation);
}

function updateDisplay(phrase, translation) {
  phraseDisplay.innerText = phrase;
  translationDisplay.innerText = translation;
}

function getCurrentPhrase() {
  var phrase = phrases[currentPhrase].phrase;
  var translation = phrases[currentPhrase].translation;
  return { phrase, translation };
}

function onKeyPress(event){
  if (event.keyCode == 32)
  audios[0].play()
}
