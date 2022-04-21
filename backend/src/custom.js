/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  return {
    type: question.type,
    question: question.question,
    attachmentType: question.attachmentType,
    attachment: question.attachment,
    time: question.time,
    answers: question.answers,
  };
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const getAnswer = [];
  if (question.type === 'SC') {
    getAnswer.push(question.corrctAnswer);
  }
  else {
    for (let x = 0; x < question.corrctAnswer.length; x+=1) {
      getAnswer.push(question.corrctAnswer[x]);
    }
  }
  return getAnswer; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  const getAnswer = [];
  for (let x = 0; x < question.answers.length; x+=1) {
    getAnswer.push(question.answers[x]);
  }
  return getAnswer; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time;
};
