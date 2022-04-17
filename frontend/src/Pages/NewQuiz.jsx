import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import { useHistory } from 'react-router-dom';
import API from './api';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default () => {
  // const history = useHistory();
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const [files, setFiles] = useState('');
  // const [quizList, setQuizList] = useState([]);

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      let isJSON = true;
      try {
        const test = JSON.parse(event.target.result);
        setFiles(test);
      } catch {
        isJSON = false;
        setFiles('');
      }
      if (!isJSON) {
        alert('File is not a json file, upload the correct file');
      }
    };
  };
  // console.log(files);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // console.log('Why');
  };
  const api = new API('http://localhost:5005');
  const createNewQuiz = async (event) => {
    event.preventDefault();
    api.get('admin/quiz', {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'GET',
    })
      .then((data) => {
        // setQuizList(data);
        if (files === '') {
          let nameFound = false;
          for (let x = 0; x < data.quizzes.length; x += 1) {
            if (name === data.quizzes[x].name) {
              nameFound = true;
              break;
            }
          }
          if (nameFound === true) {
            alert('Quiz name is already in use!');
            return;
          }
          api.post('admin/quiz/new', {
            headers: {
              accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            method: 'POST',
            body: JSON.stringify({
              name,
            }),
          })
            .then(() => {
              // console.log(data.token);
              handleClose();
              // history.push('/dashboard');
              window.location.reload();
            })
            .catch((err) => {
              handleClose();
              alert(err);
            });
        } else {
          let nameFound = false;
          for (let x = 0; x < data.quizzes.length; x += 1) {
            if (files.name === data.quizzes[x].name) {
              nameFound = true;
              break;
            }
          }
          if (nameFound === true) {
            alert('Quiz name is already in use!');
            return;
          }
          const questionArray = [];
          let success = true;
          if (files.name === null) {
            success = false;
          }
          try {
            for (let x = 0; x < files.questions.length; x += 1) {
              if (!(files.questions[x].type === 'MC' || files.questions[x].type === 'SC')) {
                success = false;
              }
              if (files.questions[x].question === null) {
                success = false;
              }
              if (files.questions[x].answers.length < 2) {
                success = false;
              }
              if (Number.isNaN(parseInt(files.questions[x].time, 10))
              && Number.isNaN(parseInt(files.questions[x].points, 10))) {
                success = false;
              }
              if (success === false) {
                alert('Improper JSON format. Please check your data structure and try again.');
                setFiles('');
                return;
              }
              const submittedQuestion = {
                id: x + 1,
                type: files.questions[x].type,
                question: files.questions[x].question,
                answers: files.questions[x].answers,
                correctAnswer: files.questions[x].correctAnswer,
                noOfAnswers: 4,
                attachmentType: 'image',
                attachment: null,
                time: files.questions[x].time,
                points: files.questions[x].points,
              };
              questionArray.push(submittedQuestion);
            }
          } catch {
            alert('Improper JSON format. Please check your data structure and try again.');
            setFiles('');
            return;
          }
          api.post('admin/quiz/new', {
            headers: {
              accept: 'application/json',
              'Content-type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            method: 'POST',
            body: JSON.stringify({
              name: files.name,
            }),
          })
            .then(() => {
              // console.log(data.token);
              api.get('admin/quiz', {
                headers: {
                  accept: 'application/json',
                  'Content-type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                method: 'GET',
              })
                .then((data2) => {
                  let quizID = null;
                  for (let x = 0; x < data2.quizzes.length; x += 1) {
                    if (files.name === data2.quizzes[x].name) {
                      quizID = data2.quizzes[x].id;
                      break;
                    }
                  }
                  api.put(`admin/quiz/${quizID}`, {
                    headers: {
                      accept: 'application/json',
                      'Content-type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                      questions: questionArray,
                      name: files.name,
                      thumbnail: null,
                    }),
                  })
                    .then(() => {
                      handleClose();
                      // history.push('/dashboard');
                      window.location.reload();
                    });
                });
            })
            .catch((err) => {
              handleClose();
              alert(err);
            });
        }
      });
  };

  return (
    <div>
      <Button onClick={handleOpen} className={classes.link}>
        New Quiz
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <form className={classes.paper} onSubmit={createNewQuiz}>
            <h2 id="transition-modal-title">Create a New Quiz</h2>
            <TextField
              autoComplete="fname"
              name="name"
              fullWidth
              id="name"
              label={(files !== '' ? 'JSON file is valid. Create quiz w/ text disabled' : 'Name of quiz')}
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={files !== ''}
            />
            <Typography style={{ marginTop: '20px' }}>
              Or
            </Typography>
            <Typography style={{ marginTop: '5px' }}>
              Upload JSON File
            </Typography>
            <input
              type="file"
              name="attachment"
              id="attachment"
              onChange={handleChange}
              disabled={name !== ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create
            </Button>
          </form>
        </Fade>
      </Modal>
    </div>
  );
};
