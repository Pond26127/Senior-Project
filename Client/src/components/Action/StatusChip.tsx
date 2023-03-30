import React from 'react';
import styled from 'styled-components';

import { Chip } from '@mui/material';
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
  status: 'Available' | 'Full' | String;
}

const StatusChip: React.FC<StatusTagProps> = ({ status }) => {
  switch (status) {
    case 'Available': {
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
    case 'Full': {
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
    default: {
      return (
        <Status
          label="No Data"
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
