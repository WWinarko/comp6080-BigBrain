import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import Navbar from './Navbar';
import API from './api';
import QuizCard from './QuizCard';

export default () => {
  const history = useHistory();
  if (localStorage.getItem('token') == null) {
    history.push('/login');
  }
  const [quizList, setQuizList] = useState([]);
  const [activeSessions, setActiveSessions] = useState(0);
  const [getTime, setTime] = useState([]);
  React.useEffect(() => {
    console.log(`session: ${activeSessions}`);
    const api = new API('http://localhost:5005');
    const loadQuiz = () => {
      api.get('admin/quiz', {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'GET',
      })
        .then((data) => {
          console.log(data);
          // addQuiz(quizes => [...quizes, data.])
          if (data.quizzes.length > 0) {
            const getQuizzes = [];
            for (let x = 0; x < data.quizzes.length; x += 1) {
              getQuizzes.push(data.quizzes[x]);
            }
            const promises = getQuizzes.map((eachItem) => new Promise((resolve, reject) => {
              api.get(`admin/quiz/${eachItem.id}`, {
                headers: {
                  accept: 'application/json',
                  'Content-type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                method: 'GET',
              })
                .then((data2) => {
                  // data2.id = eachItem.id;
                  const getJSON = data2;
                  const testNEW = getJSON;
                  testNEW.id = eachItem.id;
                  // getJSON.id = eachItem.id;
                  // const backToJSON = JSON.parse(testNEW);
                  console.log(typeof testNEW);
                  resolve(testNEW);
                })
                .catch((err2) => {
                  alert('Get quiz ID failed!');
                  reject(err2);
                });
              // resolve(eachItem);
            }));
            Promise.all(promises).then((displayItem) => {
              // console.log(displayItem);
              const time = [];
              for (let x = 0; x < displayItem.length; x += 1) {
                let totalTime = 0;
                for (let y = 0; y < displayItem[x].questions.length; y += 1) {
                  totalTime += parseInt(displayItem[x].questions[y].time, 10);
                }
                time.push(totalTime);
              }
              setTime(time);
              setQuizList(displayItem);
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    };
    loadQuiz();
  }, [activeSessions]);
  // console.log(quizList);
  // quizList.map((quiz) => console.log(quiz));
  return (
    <div>
      <Navbar>{' '}</Navbar>
      <Container maxWidth="md" component="main">
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          All Quizzes
        </Typography>
        <Grid container spacing={5} alignItems="flex-end">
          {quizList.map((quiz, index) => (
            <Grid
              item
              key={quiz.id} // this key should be change because quiz name is not unique
              xs={12}
              sm={6}
              md={4}
            >
              <QuizCard setActiveSessions={setActiveSessions} activeSessions={activeSessions} active={quiz.active} name={quiz.name} url={quiz.thumbnail} noofQuestions={`${quiz.questions.length} questions`} id={quiz.id} time={getTime[index]} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};
