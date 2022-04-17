import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import CancelIcon from '@material-ui/icons/Cancel';
import Button from '@material-ui/core/Button';
import { useLocation, useHistory } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Navbar from './Navbar';
import API from './api';
import fileToDataUrl from './helpers';
// import EditQuestion from './EditQuestion';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const history = useHistory();
  if (localStorage.getItem('token') == null) {
    history.push('/login');
  }
  const [getQuiz, setQuiz] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [imageAttachment, setImageAttachment] = useState('');
  const [attachment, setAttachment] = useState(null);
  const handleImageAttachment = (event) => {
    setImageAttachment(event.target.files);
  };

  React.useEffect(() => {
    if (imageAttachment !== '') {
      const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const valid = validFileTypes.find((type) => type === imageAttachment[0].type);
      if (valid) {
        fileToDataUrl(imageAttachment[0])
          .then((data) => {
            setAttachment(data);
          })
          .catch(() => {
            alert('Alert, base64 error.');
            setImageAttachment('');
          });
      } else {
        alert('Error: Please ensure that provided file is valid a png, jpg or jpeg image.');
        setImageAttachment('');
      }
    }
  }, [imageAttachment]);
  // const [getQuestions, setQuestions] = useState([]);
  const getURL = useQuery();
  const quizid = getURL.get('id');
  React.useEffect(() => {
    const api = new API('http://localhost:5005');
    const loadQuiz = async () => {
      api.get(`admin/quiz/${quizid}`, {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'GET',
      })
        .then((data) => {
          const testcopy = data;
          setQuiz(testcopy);
          setQuizName(testcopy.name);
          setAttachment(testcopy.thumbnail);
          // console.log(testcopy.questions[2].correctAnswer);
        })
        .catch((err) => {
          alert(err);
        });
    };
    loadQuiz();
  }, [quizid]);
  const getname = getQuiz.name;
  // const history = useHistory();
  const api = new API('http://localhost:5005');
  const updateQuizDetails = () => {
    api.put(`admin/quiz/${quizid}`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        questions: getQuiz.questions,
        name: quizName,
        thumbnail: attachment,
      }),
    })
      .then(() => {
        api.get(`admin/quiz/${quizid}`, {
          headers: {
            accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          method: 'GET',
        })
          .then((data) => {
            const testcopy = data;
            setQuiz(testcopy);
          });
      })
      .catch((err) => {
        alert(err);
      });
  };
  const deleteQuiz = () => {
    api.delete(`admin/quiz/${quizid}`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'DELETE',
    })
      .then(() => {
        history.push('/dashboard');
      })
      .catch((err) => {
        alert(err);
      });
  };
  /*
  const testAdd = () => {
    // const getOldArray = getQuiz.questions.slice();
    api.put(`admin/quiz/${quizid}`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        questions: [{
          id: 1,
          type: 'SC',
          question: 'Who won 2016 US elections',
          answers: [
            'Clinton',
            'Trump',
            'Moscow',
            'Thomas the Train',
          ],
          correctAnswer: 2,
          noOfAnswers: 4,
          attachmentType: null,
          attachment: null,
          time: 45,
          points: 10,
        }],
        name: getname,
        thumbnail: null,
      }),
    })
      .then(() => {
        api.get(`admin/quiz/${quizid}`, {
          headers: {
            accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          method: 'GET',
        })
          .then((data) => {
            const testcopy = data;
            setQuiz(testcopy);
          });
      })
      .catch((err) => {
        alert(err);
      });
  };
  */
  const editQuestion = (questionid) => {
    // console.log(questionid);
    history.push({
      pathname: '/editQuestion',
      search: `?id=${quizid}&questionid=${questionid}`,
    });
  };
  const deleteQuestion = (questionid) => {
    // console.log(questionid);
    const placeholderQuizArray = [];
    for (let x = 0; x < getQuiz.questions.length; x += 1) {
      // console.log(getQuiz.questions[x].id);
      if (getQuiz.questions[x].id !== questionid) {
        placeholderQuizArray.push(getQuiz.questions[x]);
      }
    }
    // console.log(placeholderQuizArray);
    for (let x = 0; x < placeholderQuizArray.length; x += 1) {
      placeholderQuizArray[x].id = x + 1;
    }
    api.put(`admin/quiz/${quizid}`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        questions: placeholderQuizArray,
        name: getname,
        thumbnail: null,
      }),
    })
      .then(() => {
        api.get(`admin/quiz/${quizid}`, {
          headers: {
            accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          method: 'GET',
        })
          .then((data) => {
            const testcopy = data;
            setQuiz(testcopy);
          });
      })
      .catch((err) => {
        alert(err);
      });
    // console.log(placeholderQuizArray);
  };
  const addQuestion = () => {
    // console.log(questionid);
    history.push({
      pathname: '/editQuestion',
      search: `?id=${quizid}`,
    });
  };
  // const gettest = getQuiz.questions;
  // console.log(gettest);
  return (
    <div>
      <Navbar>{' '}</Navbar>
      <Container maxWidth="md" component="main">
        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
          {`All Questions for ${getQuiz.name}`}
        </Typography>
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={3}>
            <div style={{
              minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}
            >
              <img
                src={(attachment == null || (attachment === ''))
                  ? 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
                  : attachment}
                alt="Question Thumbnail"
                role="presentation"
                style={{ width: '100%', maxHeight: '250px' }}
              />
            </div>

          </Grid>
          <Grid item xs={3}>
            <Grid container spacing={5} alignItems="flex-end" justify="space-around">
              <Grid item xs={12}>
                <TextField
                  name="quizname"
                  variant="outlined"
                  fullWidth
                  id="quizname"
                  label="Quiz Name:"
                  value={quizName}
                  onChange={(event) => setQuizName(event.target.value)}
                  tabIndex={0}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Upload Image File
                </Typography>
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  onChange={handleImageAttachment}
                  tabIndex={0}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="buttonColor"
              onClick={() => { updateQuizDetails(); }}
              tabIndex={0}
            >
              Update Name & Thumbnail
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={5} alignItems="flex-end">
          <Grid
            item
            key="Add Question"
            xs={12}
            sm={6}
            md={6}
          >
            <Card>
              <CardContent className="cardContent">
                <ul>
                  <Typography component="li" align="center">
                    <ControlPointIcon fontSize="large" />
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button tabIndex={0} fullWidth className={getQuiz.questions ? 'buttonColor' : 'disabledButton'} onClick={() => { addQuestion(); }} disabled={!getQuiz.questions}>
                  Add Question
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid
            item
            key="Delete Quiz"
            xs={12}
            sm={6}
            md={6}
          >
            <Card>
              <CardContent className="cardContent">
                <ul>
                  <Typography component="li" align="center">
                    <CancelIcon fontSize="large" />
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button tabIndex={0} fullWidth className={getQuiz.questions ? 'redButton' : 'disabledButton'} onClick={() => { deleteQuiz(); }} disabled={!getQuiz.questions}>
                  Reset Quiz
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {getQuiz.questions && getQuiz.questions.map((question) => (
            <Grid
              item
              key={question.id}
              xs={12}
              sm={6}
              md={12}
            >
              <Card>
                <CardHeader
                  title={`Question ${question.id}: ${question.question}`}
                  subheader={`${question.points} points`}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  className="cardHeader"
                  tabIndex={0}
                />
                <CardContent className="cardContent">
                  <Grid container spacing={5} alignItems="flex-end">
                    <Grid
                      item
                      key="attachment"
                      xs={12}
                      sm={6}
                      md={6}
                    >
                      {(question.attachmentType === 'image')
                        ? (
                          <img
                            src={(question.attachment == null || (question.attachment === ''))
                              ? 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
                              : question.attachment}
                            alt={question.question}
                            style={{ width: '100%', maxHeight: '250px' }}
                          />
                        )
                        : <ReactPlayer style={{ maxWidth: '100%', maxHeight: 'auto' }} url={question.attachment} />}
                    </Grid>
                    <Grid
                      item
                      key="answers"
                      xs={12}
                      sm={6}
                      md={6}
                    >
                      <Grid container spacing={5} alignItems="flex-end" justify="space-around">
                        {question.answers.map((answer, index) => (
                          <Grid
                            item
                            key={`Answer ${answer}`}
                            xs={12}
                            sm={6}
                            md={6}
                          >
                            <Typography align="center" tabIndex={0}>
                              {`Answer ${index + 1}: ${answer}`}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      key="answer"
                      xs={12}
                      sm={6}
                      md={6}
                    >
                      <Typography align="center" tabIndex={0}>
                        {(question.type === 'SC')
                          ? `Correct answer: ${question.answers[question.correctAnswer - 1]}`
                          : `Correct answer(s): ${question.correctAnswer.map((MCAnswer) => (
                            ` ${question.answers[MCAnswer - 1]}`
                          ))}`}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      key="test"
                      xs={12}
                      sm={6}
                      md={6}
                    >
                      <Typography align="center" tabIndex={0}>
                        {`Time: ${question.time}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button tabIndex={0} fullWidth className="buttonColor" onClick={() => { editQuestion(question.id); }}>
                    Edit Button
                  </Button>
                  <Button tabIndex={0} fullWidth className="redButton" onClick={() => { deleteQuestion(question.id); }}>
                    Delete Question
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};
