import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './SideNav.mless';

export default function SideNav({
  addRightSeparator,
  addLeftSeparator,
  navItems,
  itemClickTracker,
  initialItemSelected = 0
}) {
  validateinitialItemSelected(initialItemSelected, navItems);

  const [itemSelected, setItemSelected] = useState(() => {
    itemClickTracker(initialItemSelected, navItems[initialItemSelected].label);
    return initialItemSelected;
  });

  useEffect(
    () => {
      setItemSelected(initialItemSelected);
    },
    [initialItemSelected]
  );

  return (
    <nav
      className={evaluateClassNames({
        [locals.container]: true,
        [locals.rightSeparator]: addRightSeparator,
        [locals.leftSeparator]: addLeftSeparator
      })}
    >
      <ul className={locals.list}>
        {navItems.map(({ label, checked }, i) => (
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
            <span className={locals.label}>
              {label}
              <SvgIcon
                className={evaluateClassNames({
                  [locals.icon]: true,
                  [locals.checked]: checked
                })}
                type="lib_check"
                size="xxs"
              />
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}

SideNav.propTypes = {
  addRightSeparator: PropTypes.bool,
  addLeftSeparator: PropTypes.bool,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      checked: PropTypes.bool
    })
  ).isRequired,
  itemClickTracker: PropTypes.func.isRequired,
  initialItemSelected: PropTypes.number
};

function validateinitialItemSelected(initialItemSelected, navItems) {
  if (__DEV__) {
    const maxLen = navItems.length - 1;
    invariant(
      initialItemSelected >= 0 && initialItemSelected <= maxLen,
      `initialItemSelected with value "${initialItemSelected}" is out of range. I must be >=0 and <=${maxLen}`
    );
  }
}
