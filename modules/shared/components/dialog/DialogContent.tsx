import React from 'react';
import { Dialog, IconButton } from '@mui/material';

export interface BootstrapDialogProps {
  children?: React.ReactNode;
  onClose: () => void;
  open: any;
}

export const BootstrapDialog = (props: BootstrapDialogProps) => {
  const { children, onClose, ...other } = props;

  return (
    <Dialog onClose={onClose} {...other}>
      {children}

      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          X
        </IconButton>
      ) : null}
    </Dialog>
  );
};
