import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useLocation, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';
import API from './api';

const useStyles = makeStyles((theme) => ({
  gameID: {
    marginLeft: theme.spacing(2),
  },
  mid: {
    marginTop: theme.spacing(5),
  },
  answers: {
    marginTop: theme.spacing(5),
  },
  text: {
    fontSize: '3rem',
    textAlign: 'center',
  },
  next: {
    left: theme.spacing(20),
  },
}));

export default function AdminLobby() {
  const location = useLocation().search;
  const [details, setDetails] = React.useState({});
  const [numQuestion, setNumQuestion] = React.useState(0);
  const [currPosition, setCurrPosition] = React.useState(0);
  const [timer, setTimer] = React.useState(-1);
  const [options, setOptions] = React.useState([]);
  const history = useHistory();

  React.useEffect(() => {
    const api = new API('http://localhost:5005');
    const query = new URLSearchParams(location);
    const gameID = query.get('gameid');
    api.get(`admin/session/${gameID}/status`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'GET',
    })
      .then(({ results: { questions, position } }) => {
        setCurrPosition(position);
        setNumQuestion(questions.length);
        setDetails(questions[position]);
        setTimer(questions[position].time);
        setOptions(questions[position].answers);
      })
      .catch((err) => alert(err));
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, location]);
  const classes = useStyles();

  const nextQuestion = () => {
    const api = new API('http://localhost:5005');
    const query = new URLSearchParams(location);
    const quizID = query.get('quizid');

    console.log(currPosition, numQuestion);
    if (currPosition >= numQuestion - 1) {
      api.post(`admin/quiz/${quizID}/end`, {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
      })
        .then(() => console.log('Game end'))
        .catch((err) => alert(err));
      history.push('/dashboard');
    } else {
      api.post(`admin/quiz/${quizID}/advance`, {
        headers: {
          accept: 'application/json',
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        method: 'POST',
      });
    }
  };
  return (
    <>
      <header>
        <Typography variant="h1" className={classes.text}>
          {details.question}
        </Typography>
      </header>
      <hr />
      <Grid container spacing={3} className={classes.mid}>
        <Grid item xs>
          <Typography variant="h4">
            {timer}
          </Typography>
        </Grid>
        <Grid item xs>
          {(details.attachmentType === 'image')
            ? <img src={details.attachment} alt={details.question} style={{ width: '100%', maxHeight: '250px' }} />
            : <ReactPlayer style={{ maxWidth: '100%', maxHeight: 'auto' }} url={details.attachment} />}
        </Grid>
        <Grid item xs>
          <Button variant="contained" className={classes.next} onClick={nextQuestion}>
            <Typography variant="button">
              Next Question
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} className={classes.answers}>
        {options.map((answer) => (
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="contained" className="buttonColor" disabled key={answer}>
              <Typography variant="button">
                {answer}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
