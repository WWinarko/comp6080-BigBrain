import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useLocation } from 'react-router-dom';
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

}));

export default function PlayerGame() {
  const location = useLocation().search;
  const [details, setDetails] = React.useState({});
  const [timer, setTimer] = React.useState(-1);
  const [options, setOptions] = React.useState([]);
  const [start, setStart] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  React.useEffect(() => {
    const query = new URLSearchParams(location);
    const api = new API('http://localhost:5005');
    const playerID = query.get('id');
    api.get(`play/${playerID}/question`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'GET',
    })
      .then(({ question }) => {
        console.log(question);
        setDetails(question);
        if (timer === -1 || start !== question.isoTimeLastQuestionStarted) {
          console.log(start, question.isoTimeLastQuestionStarted);
          setTimer(parseInt(question.time, 10));
          setStart(question.isoTimeLastQuestionStarted);
        }
        setOptions(question.answers);
        if (timer === 0) {
          api.get(`play/${playerID}/answer`, {
            headers: {
              accept: 'application/json',
              'Content-type': 'application/json',
            },
            method: 'GET',
          }).then((ans) => console.log(ans))
            .then(() => {
              setInterval(() => {
                api.get(`play/${playerID}/question`, {
                  headers: {
                    accept: 'application/json',
                    'Content-type': 'application/json',
                  },
                  method: 'GET',
                })
                  .then(({ question: { time, isoTimeLastQuestionStarted } }) => {
                    if (start !== isoTimeLastQuestionStarted) {
                      setTimer(parseInt(time, 10));
                      setStart(isoTimeLastQuestionStarted);
                    }
                  });
              }, 1000);
            });
        }
      })
      .catch((err) => alert(err));
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, location, start, answers]);
  const classes = useStyles();
  const changeAnswers = (id) => {
    const copy = [...answers];
    if (details.type === 'MC') {
      if ((copy.find((ans) => ans === id))) {
        const i = copy.indexOf(id);
        copy.splice(i, 1);
        setAnswers(copy);
      } else {
        setAnswers([...answers, id]);
      }
    } else if (details.type === 'SC') {
      if ((copy.find((ans) => ans === id))) {
        setAnswers([]);
      } else {
        setAnswers([id]);
      }
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
        <Grid item xs />
      </Grid>
      <Grid container spacing={3} className={classes.answers}>
        {options.map((answer) => (
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="contained" className={(answers.find((ans) => ans === answer)) ? 'buttonColor' : null} onClick={() => changeAnswers(answer)} key={answer}>
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
