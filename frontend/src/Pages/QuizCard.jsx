import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import GameDialog from './GameDialog';
import ResultDialog from './ResultDialog';
import './QuizCard.css';
import API from './api';
import { getSessionID } from './helpers';

export default function QuizCard({
  name, url, noofQuestions, id, active, setActiveSessions, activeSessions, time,
}) {
  const [open, setOpen] = React.useState(false);
  const [gameEnd, setGameEnd] = React.useState(false);

  const api = new API('http://localhost:5005');
  const history = useHistory();
  const editQuiz = () => {
    history.push({
      pathname: '/edit',
      search: `?id=${id}`,
    });
  };

  const startGame = () => {
    api.post(`admin/quiz/${id}/start`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'POST',
    })
      .then(() => console.log('Game start'))
      .then(() => setActiveSessions(activeSessions + 1))
      .then((setOpen(true)))
      .then(() => getSessionID(id))
      .then((sessionID) => window.open(`http://localhost:3000/admin/lobby?quizid=${id}&gameid=${sessionID}`, '_blank'))
      .catch((err) => alert(err));
  };

  const endGame = () => {
    api.post(`admin/quiz/${id}/end`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'POST',
    })
      .then(() => console.log('Game end'))
      .then(() => setActiveSessions(activeSessions - 1))
      .then(() => setGameEnd(true))
      .catch((err) => alert(err));
  };
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const timeOfQuiz = `${minutes} minutes ${seconds} seconds`;
  return (
    <Card>
      <CardHeader
        title={name}
        subheader={noofQuestions}
        titleTypographyProps={{ align: 'center' }}
        subheaderTypographyProps={{ align: 'center' }}
        className="cardHeader"
        tabIndex={0}
        aria-label={`Quiz title: ${name}, ${noofQuestions}`}
      />
      <CardContent className="cardContent">
        <div style={{ minHeight: '250px' }}>
          <img
            src={(url == null)
              ? 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
              : url}
            alt={`${name} thumbnail`}
            style={{ width: '100%', maxHeight: '250px' }}
          />
        </div>
        <ul>
          <Typography component="li" align="center">
            {name}
          </Typography>
          <Typography component="li" align="center" tabIndex={0} aria-label={`Completion time ${timeOfQuiz}`}>
            {timeOfQuiz}
          </Typography>
        </ul>
      </CardContent>
      <CardActions>
        { (active === null)
          ? (
            <>
              <Button fullWidth variant="contained" onClick={startGame} className="greenButton" aria-label="Start Game">
                Start Game
              </Button>
              <Button fullWidth onClick={editQuiz} className="buttonColor" aria-label="Edit Button">
                Edit Button
              </Button>
            </>
          )
          : (
            <>
              <Button fullWidth variant="contained" onClick={endGame} className="redButton" aria-label="End Game">
                End Game
              </Button>
              <Button fullWidth onClick={() => setOpen(true)} className="buttonColor" aira-label="Game URL">
                Game URL
              </Button>
            </>
          )}
      </CardActions>
      <GameDialog open={open} handleClose={() => setOpen(false)} sessionID={active} />
      <ResultDialog open={gameEnd} handleClose={() => setGameEnd(false)} />
    </Card>
  );
}
QuizCard.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  noofQuestions: PropTypes.string,
  id: PropTypes.number,
  active: PropTypes.number,
  setActiveSessions: PropTypes.func,
  activeSessions: PropTypes.number,
  time: PropTypes.number,
};
QuizCard.defaultProps = {
  name: null,
  url: 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg',
  noofQuestions: 0,
  id: null,
  active: null,
  setActiveSessions: null,
  activeSessions: 0,
  time: 0,
};
