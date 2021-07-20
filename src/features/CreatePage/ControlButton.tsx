import React from 'react';
import styled from 'styled-components';

export interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  keyCode: string;
  active?: boolean;
  disabled?: boolean;
}

export const ControlButton = ({
  onClick,
  children,
  label,
  keyCode,
  active = false,
  disabled = false,
  ...rest
}: ControlButtonProps) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === keyCode) {
        handleClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClick]);

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      {...{...rest, active}}
    >
      {children}
      <Tooltip>{label}</Tooltip>
    </Button>
  );
};

const Button = styled.button`
  position: relative;
  border: none;
  font-size: 2rem;
  padding: 0 1.2rem;
  height: 100%;
  background-color: #fff;
  color: ${props => props.theme.colors.gray[600]};

  &:not(:last-child) {
    border-right: 1px solid ${props => props.theme.colors.gray[200]};
  }

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.black};
    &:not(:disabled) {
      background-color: ${props => props.theme.colors.gray[100]};
    }
  }

  @media (hover: hover) {
    &:hover > span {
      visibility: visible;
      opacity: 1;
      transform: translate3d(-50%, 133%, 0);
    }
  }

  &:disabled {
    cursor: not-allowed;
    color: ${props => props.theme.colors.gray[400]};
  }

  &:focus {
    box-shadow: inset 0 0 0 2px ${props => props.theme.colors.blue[200]};
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  position: absolute;
  opacity: 0;
  bottom: 0;
  left: 50%;
  width: max-content;
  padding: 4px 1.2rem;
  margin-top: 1rem;
  background-color: #333;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 2rem rgba(0, 0, 0, 0.04);
  text-align: center;
  color: #fff;
  font-size: 12px;
  transform: translate3d(-50%, 100%, 0);
  transition: all 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 6px solid #333;
    top: -6px;
    left: 87px;
    z-index: 1090;
    left: 50%;
    transform: translate3d(-50%, 10%, 0);
  }
`;
