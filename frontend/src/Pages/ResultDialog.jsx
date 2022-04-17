import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

export default function GameDialog({ open, handleClose }) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="game-dialog"
      >
        <DialogTitle id="game-id">Game End</DialogTitle>
        <DialogContent>
          <DialogContentText id="game-id-content">
            Would you like to view the results?
          </DialogContentText>
          <Box mx={10}>
            <Button
              className="greenButton"
              color="primary"
              fullWidth
            >
              Yes
            </Button>
          </Box>
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
};
GameDialog.defaultProps = {
  open: false,
  handleClose: null,
};
