import { Chip } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const Status = styled(Chip)`
  height: 2.2rem;
  border-radius: 1.1rem;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  text-align: center;
  align-items: center;
`;

interface StatusTagProps {
  status: 'available' | 'full' | String;
}

const StatusChip: React.FC<StatusTagProps> = ({ status }) => {
  switch (status) {
    case 'available': {
      return (
        <Status
          label="Available"
          style={{
            color: '#18b598',
            backgroundColor: 'rgba(24, 181, 152, 0.17)'
          }}
        />
      );
    }
    case 'full': {
      return (
        <Status
          label="Full"
          style={{
            color: '#b9170f',
            backgroundColor: 'rgba(185, 23, 15, 0.17)'
          }}
        />
      );
    }
    case 'canceled': {
      return (
        <Status
          label="Canceled"
          style={{
            backgroundColor: 'rgba(126, 126, 126, 0.17)',
            color: ' #7e7e7e'
          }}
        />
      );
    }
    default: {
      return (
        <Status
          label="Pending"
          style={{
            color: '#cd8507',
            backgroundColor: 'rgba(251, 170, 28, 0.17)'
          }}
        />
      );
    }
  }
};

export default StatusChip;
