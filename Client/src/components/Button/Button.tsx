import { ButtonProps } from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MouseEventHandler } from 'react';
import styled from 'styled-components';

export interface CustomButtonProps extends ButtonProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    label?: string;
    disabled?: boolean;
    secondary?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    width?: string;
    height?: string;
  }

const Button = styled.button<{
    width: string;
    height: string;
    disabled: boolean;
  }>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    border-radius: 0.6rem;
    border: none;
    text-align: center;
    cursor: ${(props) => (props.disabled ? 'unset' : 'pointer')};
    margin: 0;
  `;
  
  
export const ButtonText = styled(Typography)`
  font-weight: bold;
  font-size: 1.4rem;
  text-transform: none;
  color: #ffffff;
  gap: 8px
`;

export const CustomButton: React.FC<CustomButtonProps> = ({
    type = 'submit',
    height = '44px',
    width = '140px',
    label,
    disabled = false,
    onClick,
    secondary,
    children,
    ...rest
  }) => {
    if (secondary) {
      return (
        <Button
          type="submit"
          disabled={disabled}
          height={height}
          width={width}
          onClick={onClick}
          style={{ background: '#EBEBE4', border: '1px solid #999999' }}
          {...rest}>
          <ButtonText style={{ color: '#C6C6C6' }}>{label || children}</ButtonText>
        </Button>
      );
    }
    return (
      <Button
        type='submit'
        disabled={disabled}
        height={height}
        width={width}
        style={{ backgroundColor: '#FFFFFF', borderColor: "#000000", border: '2px solid #000000'  }}
        onClick={onClick}
        {...rest}>
        <ButtonText style={{ color: '#000000'}}>{label || children}</ButtonText>
      </Button>
    );
  };