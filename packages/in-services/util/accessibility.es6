import keyCodes from 'in-components/keyCodes';

// Typical usage:
// keyUp={getKeyboardActivatedOnClickHandler(onClick)}
//
// Warning: Be careful when marking up links with the button role. Buttons are expected to be triggered using
// the Space or Enter key, while links are expected to be triggered using the Enter key. In other words, when links
// are used to behave like buttons, adding role="button" alone is not sufficient. It will also be necessary to add a
//  key event handler that listens for the Space key in order to be consistent with native buttons.
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
export function getKeyboardActivatedOnClickHandler(fn) {
  if (!fn) {
    return undefined;
  }

  return e => {
    if (e.keyCode === keyCodes.enter || e.keyCode === keyCodes.space) {
      e.preventDefault();
      e.stopPropagation();
      fn(e);
    }
  };
}
