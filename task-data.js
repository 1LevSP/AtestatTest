// Задачи добавляются в этом массиве. Изображения для них храните в папке IMG_TASK.
// Формат записи такой же, как в quiz-data.js:
// {
//     question: "Текст задачи",
//     imgLink: "IMG_TASK/task-1.jpg",
//     answers: [
//         { text: "Правильный ответ", correct: true },
//         { text: "Неверный ответ", correct: false },
//     ],
// },


//  ПОМЕНЯТЬ ФОРМАТ ФОТОК ОБЪЯСНЕНИЯ С ПНГ НА JPG

const taskData = [
    {
        question: "t1 Введите числовой ответ к задаче на изображении.",
        imgLink: "IMG_TASK/t1.jpg",
        numericAnswer: 27,
        explanationImg: "IMG_EXPLAN/e1.png",
    },
    {
        question: "t2 Введите числовой ответ к задаче на изображении.",
        imgLink: "IMG_TASK/t2.jpg",
        numericAnswer: 79,
        explanationImg: "IMG_EXPLAN/e2.png",
    },
    {
        question: "t3 Введите числовой ответ к задаче на изображении.",
        imgLink: "IMG_TASK/t3.jpg",
        numericAnswer: 47,
        explanationImg: "IMG_EXPLAN/e3.png",
    },
];
