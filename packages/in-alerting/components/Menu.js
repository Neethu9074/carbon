/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import locals from 'in-alerting/components/Menu.mless';

export default function Menu({ addRightSeparator = false, items, onItemClick, initialItemSelected }) {
  validateInitialItemSelected(initialItemSelected, items);

  const [itemSelected, setItemSelected] = useState(() => {
    return initialItemSelected;
  });

  return (
    <nav
      className={classNames({
        [locals.container]: true,
        [locals.rightSeparator]: addRightSeparator
      })}
    >
      <ul className={locals.list}>
        {items.map((item, i) => (
          <li
            key={i}
            className={classNames({
              [locals.item]: true,
              [locals.selected]: itemSelected.type === item.type && itemSelected.subType === item.subType
            })}
            onClick={() => {
              setItemSelected(item);
              onItemClick(item);
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}

Menu.propTypes = {
  addRightSeparator: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      subType: PropTypes.string,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
  initialItemSelected: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

function validateInitialItemSelected(initialItemSelected, items) {
  if (__DEV__) {
    invariant(
      items.find(item => item.type === initialItemSelected.type),
      `The given initialItemSelected with type "${initialItemSelected.type}" is not present in the list of items.`
    );
  }
}
