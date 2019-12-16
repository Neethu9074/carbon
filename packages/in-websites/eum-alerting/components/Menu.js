import React, { useState } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Menu.mless';

export default function Menu({ addRightSeparator = false, itemLabels, itemClickTracker, initialItemSelected = 0 }) {
  validateinitialItemSelected(initialItemSelected, itemLabels);

  const [itemSelected, setItemSelected] = useState(() => {
    return initialItemSelected;
  });

  return (
    <nav
      className={evaluateClassNames({
        [locals.container]: true,
        [locals.rightSeparator]: addRightSeparator
      })}
    >
      <ul className={locals.list}>
        {itemLabels.map((label, i) => (
          <li
            key={i}
            className={evaluateClassNames({
              [locals.item]: true,
              [locals.selected]: itemSelected === i
            })}
            onClick={() => {
              setItemSelected(i);
              itemClickTracker(i, label);
            }}
          >
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

Menu.propTypes = {
  addRightSeparator: PropTypes.bool,
  itemLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemClickTracker: PropTypes.func.isRequired,
  initialItemSelected: PropTypes.number
};

function validateinitialItemSelected(initialItemSelected, itemLabels) {
  if (__DEV__) {
    const maxLen = itemLabels.length - 1;
    invariant(
      initialItemSelected >= 0 && initialItemSelected <= maxLen,
      `initialItemSelected with value "${initialItemSelected}" is out of range. I must be >=0 and <=${maxLen}`
    );
  }
}
