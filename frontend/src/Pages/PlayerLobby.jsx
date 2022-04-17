import React from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
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
    marginTop: theme.spacing(20),
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

export default function PlayerLobby() {
  const [name, setName] = React.useState('');

  const api = new API('http://localhost:5005');
  const query = new URLSearchParams(useLocation().search);
  const currentURL = window.location.href;
  const history = useHistory();
  const gameID = query.get('id');

  const classes = useStyles();

  const submitForm = async (event) => {
    event.preventDefault();
    api.post(`play/join/${gameID}`, {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
    })
      .then((data) => {
        console.log('Player joined');
        console.log(data);
        history.push(`/player/game?id=${data.playerId}`);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      <header>
        <h1 className={classes.gameID}>
          {`Game ID = ${gameID}`}
          <Box ml={5} display="inline">
            <CopyButton url={currentURL} />
          </Box>
        </h1>
      </header>
      <hr />
      <Container component="main" maxWidth="xs" className={classes.paper}>
        <Typography variant="h1" className={classes.logo}>
          BigBrain
        </Typography>
        <form noValidate onSubmit={submitForm}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="playerName"
            label="Player Name"
            type="text"
            id="playerName"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Enter
          </Button>
        </form>
      </Container>
    </>
  );
}
