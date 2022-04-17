import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useLocation, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CopyButton from '../Components/CopyButton';
import API from './api';

const useStyles = makeStyles((theme) => ({
  gameID: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    fontSize: '3rem',
    fontFamily: 'raleway',
  },
  name: {
    borderRadius: 0,
  },

}));

export default function AdminLobby() {
  const api = new API('http://localhost:5005');
  const history = useHistory();
  console.log(history);
  const query = new URLSearchParams(useLocation().search);
  const gameID = query.get('gameid');
  const quizID = query.get('quizid');

  const startGame = () => {
    api.post(`admin/quiz/${quizID}/advance`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'POST',
    })
      .then((res) => console.log(res))
      .then(() => console.log('Game start'))
      .then(() => history.push(`/admin/game?quizid=${quizID}&gameid=${gameID}`))
      .catch((err) => alert(err));
  };

  const classes = useStyles();
  return (
    <>
      <header>
        <h1 className={classes.gameID}>
          {`Game ID = ${gameID}`}
          <Box ml={5} display="inline">
            <CopyButton url={`http://localhost:3000/player/lobby?id=${gameID}`} />
          </Box>
        </h1>
      </header>
      <hr />
      <Container component="main" maxWidth="xs" className={classes.paper}>
        <Typography variant="h1" className={classes.logo}>
          BigBrain
        </Typography>
        <Box mt={5}>
          <Button variant="contained" className="greenButton" onClick={startGame}>
            Start Game
          </Button>
        </Box>
      </Container>
    </>
  );
}
