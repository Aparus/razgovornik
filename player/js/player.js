var currentPhrase = 0;
var delayBetweenPhrases = 1000;
//это начальные установки программы

var source = document.getElementById("source").innerHTML.trim();
/*  в эту переменную мы загрузили текст "сырого источника" - таблицу. 

      Good morning!	Доброе утро!	001.mpeg
      Did the alarm clock go off?	Будильник звонил?	002.mpeg
      It's time to get up.	Время вставать!	003.mpeg

В ней строки разделены невидимым символом разрыва строки "\n"
А внутри строки столбцы разделены невидимым символом табуляции "\t". 
Они перенеслись, когда мы скопировали таблицу из google-docs и вставили её в text.html, 
В дальнейшем мы будем использовать эти невидимые символы при "парсинге" текста. 
Парсинг - это когда сплошной текст разделяют на логические единицы. 
*/

var phrases = source.split("\n");
var audioLinks = [];
phrases = phrases.map(elem => {
  var phraseArray = elem.trim().split("\t");
  var [phrase, translation, audioLink] = phraseArray;
  audioLinks.push(audioLink);
  return { phrase, translation };
});
/*
мы считали текстовую таблицу в 2 глобальных переменных: phrases, audioLinks
их можно вывести в консоли. Название во множественном числе подсказывает, что это массивы. 

phrases = [
  {phrase: "Good morning!", translation: "Доброе утро!"}
  {phrase: "Did the alarm clock go off?", translation: "Будильник звонил?"}
  {phrase: "It's time to get up.", translation: "Время вставать!"}
]
то есть теперь мы можем получать отдельно фразу или перевод, таким путём:
phrases[0].phrase - выдаст "Good morning!"
phrases[2].translation - выдаст "Время вставать!"


audioLinks = ["001.mpeg", "002.mpeg", "003.mpeg"]
*/


var audios = audioLinks.map(audioLink => {
  return new Audio("audios/" + audioLink);
});
/* 
audioLinks - это лишь набор строк с названиями аудиофайлов. 
audios - это набор аудио элементов, мы их сгенерировали из адресов файлов. 
Аудио элемент - это DOM объект, с набором особых свойств, о которых можно прочитать в документации html5 audio
обращаясь к каждому отдельному элементу, мы можем управлять его воспроизведением, менять скорость, 
перематывать его, отслеживать его окончание, регулировать громкость и т.д. 
например: 
метод audios[0].play() - начнет воспроизведение 1-го аудио. 
событие audios[2].onended запустится при завершении 3-го аудио. 
*/

var phraseDisplay = document.getElementById("phraseDisplay");
var translationDisplay = document.getElementById("translationDisplay");
// это видимое отображение фразы и её перевода на экране

// event listeners
audios.forEach(audio => {
  audio.onended = onAudioEnded;
  audio.onplaying = onAudioStarted;
});
// мы прошлись по всем аудио элементам и установили обработчики событий onEnded и onPlaying свои функции (код ниже)


function onAudioEnded() {
  currentPhrase++;
  if (audios[currentPhrase]) {
    setTimeout(() => audios[currentPhrase].play(), delayBetweenPhrases);
  } else {
    updateDisplay("", "");
    currentPhrase = 0
  }
}
// по окончанию аудио файла мы увеличиваем номер текущей фразы на +1. и если аудио ещё есть в нашем наборе audios, 
// то выжидаем задержку delayBetweenPhrases и проигрываем файл, 
// а если файлы кончились, то всё обнуляем в проге, как будто её только что включили

function onAudioStarted() {
  var { phrase, translation } = getCurrentPhrase();
  updateDisplay(phrase, translation);
}

// обновляет отображение плеера, подставляя в него текст из текущей фразы
function updateDisplay(phrase, translation) {
  phraseDisplay.innerText = phrase;
  translationDisplay.innerText = translation;
}

// возвращает текст текущей фразы и перевод
function getCurrentPhrase() {
  var phrase = phrases[currentPhrase].phrase;
  var translation = phrases[currentPhrase].translation;
  return { phrase, translation };
}

// отслеживает нажатую клавишу и если это пробел, то запускает проигрывание
// вызов этой функции находится в text.html
// я сделал это через клавишу, чтобы в отображении плеера не было лишних элементов, типа кнопок плей/пауза
function onKeyPress(event){
  if (event.keyCode == 32)
  audios[0].play()
}

//вот ещё что-то сделали с кодом