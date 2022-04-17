import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useLocation, useHistory } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import API from './api';
import fileToDataUrl from './helpers';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const history = useHistory();
  if (localStorage.getItem('token') == null) {
    history.push('/login');
  }
  // const [getQuiz, setQuiz] = useState([]);
  const getURL = useQuery();
  const quizid = getURL.get('id');
  const questionid = getURL.get('questionid');
  // console.log(quizid);
  // console.log(questionid);
  // const history = useHistory();
  // const [email, setEmail] = React.useState('');
  // const [password, setPassword] = React.useState('');

  const [question, updateQuestionInput] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const [time, setTimeLimit] = useState('');
  const [points, setPoints] = useState('');
  const [getQuiz, setQuiz] = useState([]);
  const [getQType, setQType] = useState('SC');
  const [questionIndex, setQIndex] = useState(null);
  const [attachment, setAttachment] = useState('');

  const handleQuestionType = (event) => {
    setQType(event.target.value);
  };

  const [attachmentType, setAttachmentType] = useState('image');

  const handleAttachmentType = (event) => {
    setAttachmentType(event.target.value);
  };

  const [videoAttachment, setVideoAttachment] = useState('');

  const [imageAttachment, setImageAttachment] = useState('');

  const handleImageAttachment = (event) => {
    setImageAttachment(event.target.files);
  };

  const handleVideoAttachment = (event) => {
    setVideoAttachment(event.target.value);
    setAttachment(event.target.value);
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

  const [MCAnswers, setMCAnswers] = React.useState({
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false,
    checked5: false,
    checked6: false,
  });
  // console.log(MCAnswers);
  const handleMCCheckboxAnswers = (event) => {
    setMCAnswers({ ...MCAnswers, [event.target.name]: event.target.checked });
  };

  const [SCAnswer, setSCAnswer] = useState('');

  const handleSCAnswers = (event) => {
    setSCAnswer(event.target.value);
  };

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
          if (testcopy.questions && questionid != null) {
            for (let x = 0; x < testcopy.questions.length; x += 1) {
              if (testcopy.questions[x].id === parseInt(questionid, 10)) {
                setQIndex(x);
                setQType(testcopy.questions[x].type);
                updateQuestionInput(testcopy.questions[x].question);
                for (let y = 0; y < testcopy.questions[x].answers.length; y += 1) {
                  if (y === 0) {
                    setAnswer1(testcopy.questions[x].answers[y]);
                  } else if (y === 1) {
                    setAnswer2(testcopy.questions[x].answers[y]);
                  } else if (y === 2) {
                    setAnswer3(testcopy.questions[x].answers[y]);
                  } else if (y === 3) {
                    setAnswer4(testcopy.questions[x].answers[y]);
                  } else if (y === 4) {
                    setAnswer5(testcopy.questions[x].answers[y]);
                  } else if (y === 5) {
                    setAnswer6(testcopy.questions[x].answers[y]);
                  }
                }
                setTimeLimit(testcopy.questions[x].time);
                setAttachmentType(testcopy.questions[x].attachmentType);
                if (testcopy.questions[x].attachmentType === 'image') {
                  setAttachment(testcopy.questions[x].attachment);
                } else {
                  setVideoAttachment(testcopy.questions[x].attachment);
                  setAttachment(testcopy.questions[x].attachment);
                }
                setPoints(testcopy.questions[x].points);
                if (testcopy.questions[x].type === 'SC') {
                  setSCAnswer((testcopy.questions[x].correctAnswer).toString());
                } else {
                  const updateMC = {
                    checked1: false,
                    checked2: false,
                    checked3: false,
                    checked4: false,
                    checked5: false,
                    checked6: false,
                  };
                  for (let y = 0; y < testcopy.questions[x].correctAnswer.length; y += 1) {
                    if (testcopy.questions[x].correctAnswer[y] === 1) {
                      updateMC.checked1 = true;
                    }
                    if (testcopy.questions[x].correctAnswer[y] === 2) {
                      updateMC.checked2 = true;
                    }
                    if (testcopy.questions[x].correctAnswer[y] === 3) {
                      updateMC.checked3 = true;
                    }
                    if (testcopy.questions[x].correctAnswer[y] === 4) {
                      updateMC.checked4 = true;
                    }
                    if (testcopy.questions[x].correctAnswer[y] === 5) {
                      updateMC.checked5 = true;
                    }
                    if (testcopy.questions[x].correctAnswer[y] === 6) {
                      updateMC.checked6 = true;
                    }
                  }
                  setMCAnswers(updateMC);
                }
                break;
              }
            }
          }
        })
        .catch((err) => {
          alert(err);
        });
    };
    loadQuiz();
  }, [quizid, questionid]);
  const api = new API('http://localhost:5005');
  // const [attachment, setAttachment] = useState('');
  const submitForm = async (event) => {
    event.preventDefault();
    if (question === '' || answer1 === '' || answer2 === '' || time === '' || points === '') {
      alert('Please fill up all required inputs.');
      return;
    }
    if (getQType === 'MC') {
      if (MCAnswers.checked1 === false && MCAnswers.checked2 === false
        && MCAnswers.checked3 === false && MCAnswers.checked4 === false
        && MCAnswers.checked5 === false && MCAnswers.checked6 === false) {
        alert('Please ensure that at least one correct answer is selected.');
        return;
      }
    }
    const addOrUpdate = getQuiz.questions.slice();
    let answer = null;
    const allAnswers = [];
    allAnswers.push(answer1);
    allAnswers.push(answer2);
    if (answer3 !== '') {
      allAnswers.push(answer3);
    }
    if (answer4 !== '') {
      allAnswers.push(answer4);
    }
    if (answer5 !== '') {
      allAnswers.push(answer5);
    }
    if (answer6 !== '') {
      allAnswers.push(answer6);
    }
    // let attachment = null;
    // console.log(imageAttachment[0]);
    if (getQType === 'SC') {
      answer = SCAnswer;
    } else {
      const dumpMCArray = [];
      if (MCAnswers.checked1 === true) {
        dumpMCArray.push(1);
      }
      if (MCAnswers.checked2 === true) {
        dumpMCArray.push(2);
      }
      if (MCAnswers.checked3 === true) {
        dumpMCArray.push(3);
      }
      if (MCAnswers.checked4 === true) {
        dumpMCArray.push(4);
      }
      if (MCAnswers.checked5 === true) {
        dumpMCArray.push(5);
      }
      if (MCAnswers.checked6 === true) {
        dumpMCArray.push(6);
      }
      answer = dumpMCArray.slice();
    }
    if (getQuiz.questions && questionIndex != null) {
      const submittedQuestion = {
        id: getQuiz.questions[questionIndex].id,
        type: getQType,
        question,
        answers: allAnswers,
        correctAnswer: answer,
        noOfAnswers: 4,
        attachmentType,
        attachment,
        time,
        points,
      };
      addOrUpdate[questionIndex] = submittedQuestion;
    } else {
      // console.log('Update question not implemented');
      const submittedQuestion = {
        id: getQuiz.questions.length + 1,
        type: getQType,
        question,
        answers: allAnswers,
        correctAnswer: answer,
        noOfAnswers: 4,
        attachmentType,
        attachment,
        time,
        points,
      };
      addOrUpdate.push(submittedQuestion);
    }
    api.put(`admin/quiz/${quizid}`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        questions: addOrUpdate,
        name: getQuiz.name,
        thumbnail: null,
      }),
    })
      .then(() => {
        history.push(`/edit?id=${quizid}`);
      });
    console.log(attachment);
  };
  const classes = useStyles();
  return (
    <div>
      <Navbar>{' '}</Navbar>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <CreateRoundedIcon />
          </Avatar>
          <Typography
            component="h1"
            tabIndex={0}
            aria-label={(getQuiz.questions && questionIndex != null)
              ? 'Edit Question'
              : 'New Question'}
          >
            {(getQuiz.questions && questionIndex != null)
              ? 'Edit Question'
              : 'New Question'}
          </Typography>
          <form className={classes.form} noValidate onSubmit={submitForm}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Question Type
                <RadioGroup
                  name="qType"
                  value={getQType}
                  onChange={handleQuestionType}
                >
                  <FormControlLabel value="SC" control={<Radio />} label="Single Choice" />
                  <FormControlLabel value="MC" control={<Radio />} label="Multiple Choice" />
                </RadioGroup>
              </Grid>
              <Grid item xs={3}>
                Attachment Type
                <RadioGroup
                  name="aType"
                  value={attachmentType}
                  onChange={handleAttachmentType}
                >
                  <FormControlLabel value="image" control={<Radio />} label="Image" />
                  <FormControlLabel value="video" control={<Radio />} label="Video" />
                </RadioGroup>
              </Grid>
              {(attachmentType === 'image')
                ? (
                  <Grid item xs={6}>
                    <Typography>
                      Upload Image File
                    </Typography>
                    <input
                      type="file"
                      name="attachment"
                      id="attachment"
                      onChange={handleImageAttachment}
                    />
                  </Grid>
                )
                : (
                  <Grid item xs={6}>
                    <TextField
                      name="attachment"
                      variant="outlined"
                      required
                      fullWidth
                      id="attachment"
                      label="Video URL:"
                      value={videoAttachment}
                      onChange={handleVideoAttachment}
                      inputProps={{ 'aria-label': 'Video attachment URL link input' }}
                    />
                  </Grid>
                )}
              <Grid item xs={12}>
                <TextField
                  name="question"
                  variant="outlined"
                  required
                  fullWidth
                  id="question"
                  label="Question:"
                  value={question}
                  onChange={(event) => updateQuestionInput(event.target.value)}
                  inputProps={{ 'aria-label': 'Question to ask input' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer1"
                  variant="outlined"
                  required
                  fullWidth
                  id="answer1"
                  label="Answer 1:"
                  value={answer1}
                  onChange={(event) => setAnswer1(event.target.value)}
                  inputProps={{ 'aria-label': 'Answer 1' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer2"
                  variant="outlined"
                  required
                  fullWidth
                  id="answer2"
                  label="Answer 2:"
                  value={answer2}
                  onChange={(event) => setAnswer2(event.target.value)}
                  inputProps={{ 'aria-label': 'Answer 2' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer3"
                  variant="outlined"
                  required
                  fullWidth
                  id="answer3"
                  label="Answer 3:"
                  value={answer3}
                  onChange={(event) => setAnswer3(event.target.value)}
                  inputProps={{ 'aria-label': 'Answer 3' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer4"
                  variant="outlined"
                  required
                  fullWidth
                  id="answer4"
                  label="Answer 4:"
                  value={answer4}
                  onChange={(event) => setAnswer4(event.target.value)}
                  inputProps={{ 'aria-label': 'Answer 4' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer5"
                  variant="outlined"
                  required
                  fullWidth
                  id="answer5"
                  label="Answer 5:"
                  value={answer5}
                  onChange={(event) => setAnswer5(event.target.value)}
                  inputProps={{ 'aria-label': 'Answer 5' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="answer6"
                  variant="outlined"
                  required
                  fullWidth
                  id="answer6"
                  label="Answer 6:"
                  value={answer6}
                  onChange={(event) => setAnswer6(event.target.value)}
                  inputProps={{ 'aria-label': 'Answer 6' }}
                />
              </Grid>
              <Grid item xs={12} aria-label="answers" tabIndex={0}>
                Correct Answer:
                {(getQType === 'SC')
                  ? (
                    <RadioGroup
                      row
                      name="answer"
                      required
                      value={SCAnswer}
                      onChange={handleSCAnswers}
                    >
                      <FormControlLabel value="1" control={<Radio />} label="1" />
                      <FormControlLabel value="2" control={<Radio />} label="2" />
                      {(answer3 !== '')
                        ? <FormControlLabel value="3" control={<Radio />} label="3" />
                        : <FormControlLabel value="3" control={<Radio />} label="3" disabled />}
                      {(answer4 !== '')
                        ? <FormControlLabel value="4" control={<Radio />} label="4" />
                        : <FormControlLabel value="4" control={<Radio />} label="4" disabled />}
                      {(answer5 !== '')
                        ? <FormControlLabel value="5" control={<Radio />} label="5" />
                        : <FormControlLabel value="5" control={<Radio />} label="5" disabled />}
                      {(answer6 !== '')
                        ? <FormControlLabel value="6" control={<Radio />} label="6" />
                        : <FormControlLabel value="6" control={<Radio />} label="6" disabled />}
                    </RadioGroup>
                  )
                  : (
                    <FormGroup row required>
                      <FormControlLabel
                        control={<Checkbox checked={MCAnswers.checked1} onChange={handleMCCheckboxAnswers} name="checked1" />}
                        label="1"
                      />
                      <FormControlLabel
                        control={<Checkbox checked={MCAnswers.checked2} onChange={handleMCCheckboxAnswers} name="checked2" />}
                        label="2"
                      />
                      {(answer3 !== '')
                        ? (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked3} onChange={handleMCCheckboxAnswers} name="checked3" />}
                            label="3"
                          />
                        )
                        : (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked3} onChange={handleMCCheckboxAnswers} name="checked3" />}
                            label="3"
                            disabled
                          />
                        )}
                      {(answer4 !== '')
                        ? (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked4} onChange={handleMCCheckboxAnswers} name="checked4" />}
                            label="4"
                          />
                        )
                        : (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked4} onChange={handleMCCheckboxAnswers} name="checked4" />}
                            label="4"
                            disabled
                          />
                        )}
                      {(answer5 !== '')
                        ? (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked5} onChange={handleMCCheckboxAnswers} name="checked5" />}
                            label="5"
                          />
                        )
                        : (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked5} onChange={handleMCCheckboxAnswers} name="checked5" />}
                            label="5"
                            disabled
                          />
                        )}
                      {(answer4 !== '')
                        ? (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked6} onChange={handleMCCheckboxAnswers} name="checked6" />}
                            label="6"
                          />
                        )
                        : (
                          <FormControlLabel
                            control={<Checkbox checked={MCAnswers.checked6} onChange={handleMCCheckboxAnswers} name="checked6" />}
                            label="6"
                            disabled
                          />
                        )}
                    </FormGroup>
                  )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="Time"
                  variant="outlined"
                  required
                  fullWidth
                  id="Time"
                  label="Time Limit:"
                  value={time}
                  onChange={(event) => setTimeLimit(event.target.value)}
                  inputProps={{ 'aria-label': 'Time to answer' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="points"
                  variant="outlined"
                  required
                  fullWidth
                  id="points"
                  label="Points Allocated:"
                  value={points}
                  onChange={(event) => setPoints(event.target.value)}
                  inputProps={{ 'aria-label': 'Points allocated' }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              aria-label={(getQuiz.questions && questionIndex != null)
                ? 'Button Update Question'
                : 'Button Add New Question'}
            >
              {(getQuiz.questions && questionIndex != null)
                ? 'Update Question'
                : 'Add New Question'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};
