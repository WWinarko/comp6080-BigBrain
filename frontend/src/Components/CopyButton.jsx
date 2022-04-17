import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
  copy: {
    color: blue[600],
    backgroundColor: blue[100],
    width: 20,
  },
});

export default function CopyButton({ url }) {
  const [openAlert, setOpenAlert] = React.useState(false);

  const classes = useStyles();
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const handleCopy = () => {
    copy(url);
    setOpenAlert(true);
  };

  return (
    <>
      <Button
        className={classes.copy}
        onClick={handleCopy}
        color="primary"
      >
        Copy
      </Button>
      <Snackbar open={openAlert} autoHideDuration={1000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity="success">
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}

CopyButton.propTypes = {
  url: PropTypes.string,
};

CopyButton.defaultProps = {
  url: '',
};
