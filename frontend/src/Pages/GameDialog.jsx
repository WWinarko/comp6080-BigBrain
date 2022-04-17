import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import CopyButton from '../Components/CopyButton';

export default function GameDialog({ open, handleClose, sessionID }) {
  const gameURL = `http://localhost:3000/player/lobby?id=${sessionID}`;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="game-dialog"
      >
        <DialogTitle id="game-id">GAME URL</DialogTitle>
        <DialogContent>
          <DialogContentText id="game-id-content">
            {sessionID}
            <Box ml={5} display="inline">
              <CopyButton url={gameURL} />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

GameDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  sessionID: PropTypes.number,
};
GameDialog.defaultProps = {
  open: false,
  handleClose: null,
  sessionID: null,
};
