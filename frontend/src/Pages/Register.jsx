import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import API from './api';

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

export default () => {
  const api = new API('http://localhost:5005');
  const history = useHistory();
  localStorage.removeItem('token');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCfm, setPasswordCfm] = React.useState('');
  const [name, setName] = React.useState('');

  const submitForm = async (event) => {
    event.preventDefault();
    if (email === '' || password === '' || name === '') {
      alert('Please fill up all inputs.');
      return;
    }
    if (!email.replace(/\s/g, '').length || !password.replace(/\s/g, '').length || !name.replace(/\s/g, '').length) {
      alert('Whitespace are not valid inputs.');
      return;
    }
    if (password !== passwordCfm) {
      alert('Passwords do not match');
      return;
    }
    api.post('admin/auth/register', {
      headers: {
        accept: 'application/json',
        'Content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    })
      .then((data) => {
        // console.log(data.token);
        localStorage.setItem('token', data.token);
        history.push('/dashboard');
      })
      .catch((err) => {
        alert(err);
      });
  };
  const toLogin = () => {
    history.push('/login');
  };
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" autoFocus tabIndex={0} aria-label="Sign Up">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={submitForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                value={name}
                inputProps={{ 'aria-label': 'Name input' }}
                onChange={(event) => setName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                inputProps={{ 'aria-label': 'Email input' }}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                inputProps={{ 'aria-label': 'Password input' }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordCfm"
                label="Confirm Password"
                type="password"
                id="passwordCfm"
                value={passwordCfm}
                inputProps={{ 'aria-label': 'Confirm Password input' }}
                onChange={(event) => setPasswordCfm(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            aria-label="Submit button"
          >
            Sign Up
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => toLogin()}
            aria-label="Back to login"
          >
            Already have an account? Sign in
          </Button>
        </form>
      </div>
    </Container>
  );
};
