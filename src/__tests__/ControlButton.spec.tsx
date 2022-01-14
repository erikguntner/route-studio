import {
  ControlButton,
  ControlButtonProps,
} from '../features/CreatePage/ControlButton';
import {Redo} from '../features/Common/Icons';
import {render, screen, userEvent} from '../utils/test/test-utils';

const renderButton = ({
  label,
  keyCode,
  disabled,
  ...rest
}: Omit<ControlButtonProps, 'onClick' | 'children'>) => {
  const onClick = jest.fn();

  render(
    <ControlButton
      label={label}
      keyCode={keyCode}
      disabled={disabled}
      {...rest}
      onClick={onClick}
    >
      <Redo />
    </ControlButton>,
  );

  return {
    onClick,
    label,
    keyCode,
  };
};

describe('ControlButton', () => {
  test('calls onClick when clicked or key is pressed', () => {
    const {onClick, keyCode} = renderButton({
      label: 'redo',
      keyCode: 'a',
      disabled: false,
    });

    const button = screen.getByRole('button', {name: /redo/i});
    expect(button).not.toBeDisabled();
    // using click event
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    // using keyboard event
    userEvent.keyboard(keyCode);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  test('does not call onClick when disabled', () => {
    const {onClick, keyCode} = renderButton({
      label: 'redo',
      keyCode: 'a',
      disabled: true,
    });

    const button = screen.getByRole('button', {name: /redo/i});
    expect(button).toBeDisabled();
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.keyboard(keyCode);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
