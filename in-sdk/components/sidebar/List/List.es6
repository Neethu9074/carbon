/* eslint-disable react/no-multi-comp */
import React from 'react';

import './List.less';

const block = 'in-list';

export default function List({ children }) {
  return (
    <ul className={block}>
      {children}
    </ul>
  );
}

List.Item = function ListItem({ children, onClick }) {
  if (__DEV__ && onClick) {
    throw new Error(
      'Illegal and old usage of an onClick handler on the List component. ' +
        'Use in-sdk/components/sidebar/ClickableList instead!'
    );
  }

  return (
    <li className={`${block}__item`}>
      {children}
    </li>
  );
};
