const quizData = [
  {
    question: "Если человека назвали мордофиля, то это…",
    answers: [
      {
        text: "Значит, что он тщеславный.",
        isCorrect: true,
        explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный."
      },
      {
        text: "Значит, что у него лицо как у хряка.",
        isCorrect: false
      },
      {
        text: "Значит, что чумазый.",
        isCorrect: false
      }
    ]
  },
  {
    question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
    answers: [
      {
        text: "Он маленький и невзрачный.",
        isCorrect: true,
        explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи."
      },
      {
        text: "Он тот еще алкоголик.",
        isCorrect: false
      },
      {
        text: "Он не держит свое слово.",
        isCorrect: false
      }
    ]
  },
  {
    question: "Если человека прозвали пятигузом, значит, он…",
    answers: [
      {
        text: "Не держит слово.",
        isCorrect: true,
        explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек."
      },
      {
        text: "Изменяет жене.",
        isCorrect: false
      },
      {
        text: "Без гроша в кармане.",
        isCorrect: false
      }
    ]
  },
  {
    question: "Кто такой шлындра?",
    answers: [
      {
        text: "Бродяга.",
        isCorrect: true,
        explanation: "Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться."
      },
      {
        text: "Обманщик.",
        isCorrect: false
      },
      {
        text: "Нытик.",
        isCorrect: false
      }
    ]
  },
  {
    question: "В каком случае про человека можно сказать, что он охренел (в смысле «обнаглел/перешёл границы»), а не просто удивился?",
    answers: [
      {
        text: "Он без спроса берёт твои вещи и делает вид, что так и надо.",
        isCorrect: true,
        explanation: "Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
      },
      {
        text: "Он в наглую лезет без очереди и ещё возмущается, что его не пропускают.",
        isCorrect: true,
        explanation: "Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть»."
      },
      {
        text: "Он съел много хрена и искренне удивился: «Какой жгучий, вот это да!»",
        isCorrect: false
      },
      {
        text: "В осеннем лесу наблюдается завихрение листьев.",
        isCorrect: false
      }
    ]
  }
];

function mixArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const TIMING = {
  shake: 420,
  pauseBeforeSlide: 2000,
  slideStep: 350,
  slideDuration: 700,
  readExplanation: 1800
};

let randomizedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnswerLocked = false;

const quizBoardElem = document.getElementById("quiz-board");
const quizStatusElem = document.getElementById("quiz-status");
const quizStatsElem = document.getElementById("quiz-stats");
const quizStatsTextElem = document.getElementById("quiz-stats-text");
const quizReloadBtn = document.getElementById("quiz-reload-btn");

function startTest() {
  quizBoardElem.innerHTML = "";
  quizStatusElem.textContent = "";
  quizStatusElem.classList.remove("quiz__status--visible");
  quizStatsTextElem.textContent = "";
  quizStatsElem.classList.add("quiz__stats--hidden");

  randomizedQuestions = mixArray(quizData).map((q) => ({
    ...q,
    answers: mixArray(q.answers)
  }));
  currentQuestionIndex = 0;
  score = 0;
  isAnswerLocked = false;

  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  if (currentQuestionIndex >= randomizedQuestions.length) {
    showResults();
    return;
  }

  const currentQ = randomizedQuestions[currentQuestionIndex];

  const rowDiv = document.createElement("div");
  rowDiv.className = "quiz__row";
  rowDiv.id = `row-${currentQuestionIndex}`;

  const qCard = document.createElement("div");
  qCard.className = "quiz__card quiz__card--question";
  qCard.id = `qcard-${currentQuestionIndex}`;

  const textSpan = document.createElement("span");
  textSpan.className = "quiz__text";
  textSpan.textContent = `${currentQuestionIndex + 1}. ${currentQ.question}`;
  qCard.appendChild(textSpan);

  rowDiv.appendChild(qCard);

  const answersContainer = document.createElement("div");
  answersContainer.className = "quiz__answers";

  isAnswerLocked = false;

  currentQ.answers.forEach((ans, idx) => {
    const card = document.createElement("div");
    card.className = "quiz__card quiz__card--answer";
    card.dataset.index = idx;

    const mainText = document.createElement("div");
    mainText.textContent = ans.text;
    card.appendChild(mainText);

    if (ans.isCorrect && ans.explanation) {
      const expDiv = document.createElement("div");
      expDiv.className = "quiz__explanation";
      expDiv.textContent = `Правильно! ${ans.explanation}`;
      expDiv.style.display = "none";
      card.appendChild(expDiv);
    }

    card.addEventListener("click", () => checkSelectedAnswer(card, ans, answersContainer, qCard));
    answersContainer.appendChild(card);
  });

  rowDiv.appendChild(answersContainer);
  quizBoardElem.appendChild(rowDiv);
}

function checkSelectedAnswer(selectedCard, chosenAnswer, answersContainer, qCard) {
  if (isAnswerLocked) return;
  isAnswerLocked = true;

  selectedCard.classList.add("quiz__card--shaking");

  const allCards = Array.from(answersContainer.querySelectorAll(".quiz__card--answer"));
  allCards.forEach((c) => c.classList.add("quiz__card--disabled"));

  const finishQuestion = () => {
    answersContainer.remove();
    currentQuestionIndex++;
    renderCurrentQuestion();
  };

  setTimeout(() => {
    selectedCard.classList.remove("quiz__card--shaking");

    if (chosenAnswer.isCorrect) {
      score++;
      selectedCard.classList.add("quiz__card--expanded");
      const exp = selectedCard.querySelector(".quiz__explanation");
      if (exp) exp.style.display = "block";

      const wrongCards = allCards.filter((c) => c !== selectedCard);
      setTimeout(() => {
        qCard.classList.add("quiz__card--correct");
        wrongCards.forEach((card, i) => {
          setTimeout(() => card.classList.add("quiz__card--slide-down"), i * TIMING.slideStep);
        });
      }, TIMING.pauseBeforeSlide);

      const slidesEnd = TIMING.pauseBeforeSlide + wrongCards.length * TIMING.slideStep + TIMING.slideDuration;
      setTimeout(() => {
        selectedCard.classList.add("quiz__card--fade-out");
        setTimeout(finishQuestion, 500);
      }, slidesEnd + TIMING.readExplanation);

    } else {
      setTimeout(() => {
        qCard.classList.add("quiz__card--wrong");
        allCards.forEach((card, i) => {
          setTimeout(() => card.classList.add("quiz__card--slide-down"), i * TIMING.slideStep);
        });
      }, TIMING.pauseBeforeSlide);

      setTimeout(finishQuestion,
        TIMING.pauseBeforeSlide + allCards.length * TIMING.slideStep + TIMING.slideDuration);
    }
  }, TIMING.shake);
}

function showResults() {
  quizStatusElem.textContent = "Вопросы закончились";
  quizStatusElem.classList.add("quiz__status--visible");

  quizStatsTextElem.textContent = `Правильных ответов: ${score} из ${randomizedQuestions.length}`;
  quizStatsElem.classList.remove("quiz__stats--hidden");

  enableAnswerReview();
}

function enableAnswerReview() {
  const cards = quizBoardElem.querySelectorAll(".quiz__card--question");

  cards.forEach((card, idx) => {
    card.classList.add("quiz__card--clickable");

    const showReview = () => {
      const wasOpen = card.classList.contains("quiz__card--active");
      quizBoardElem.querySelectorAll(".quiz__review").forEach((b) => b.remove());
      cards.forEach((c) => c.classList.remove("quiz__card--active"));
      if (wasOpen) return;

      card.classList.add("quiz__card--active");
      const qData = randomizedQuestions[idx];
      const correctAnswers = qData.answers.filter((a) => a.isCorrect);

      const reviewBox = document.createElement("div");
      reviewBox.className = "quiz__review";
      const title = document.createElement("strong");
      title.textContent = correctAnswers.length > 1 ? "Правильный ответ (любой из):" : "Правильный ответ:";
      reviewBox.appendChild(title);
      correctAnswers.forEach((a) => {
        reviewBox.appendChild(document.createElement("br"));
        reviewBox.append(`• ${a.text}`);
      });
      const em = document.createElement("em");
      em.textContent = correctAnswers[0].explanation || "";
      reviewBox.appendChild(document.createElement("br"));
      reviewBox.appendChild(em);
      card.closest(".quiz__row").appendChild(reviewBox);
    };

    card.tabIndex = 0;
    card.addEventListener("click", showReview);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showReview(); }
    });
  });
}

quizReloadBtn.addEventListener("click", startTest);

document.addEventListener("DOMContentLoaded", startTest);