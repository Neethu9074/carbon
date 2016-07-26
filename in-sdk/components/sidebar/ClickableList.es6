import React from 'react';

import {getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

import './ClickableList.less';

const block = 'in-clickable-list';

export const ClickableSnapshotListItem = connectTo(props => {
  return {
    href: getLinkToSnapshotInCurrentView(props.snapshotId)
  };
}, function ClickableSnapshotListItem({href, children}) {
  return <ClickableListItem href={href}>{children}</ClickableListItem>;
});


export function ClickableListItem({onClick, href, children}) {
  if (__DEV__ && !onClick && !href) {
    throw new Error('Usage of clickable items without onClick and href. This is not the intended usage!');
  }

  onClick = onClick || stopPropagation;

  if (href) {
    return (
      <li className={`${block}__item`}>
        <a href={href}
           onClick={onClick}
           className={`${block}__link`}>
          {children}
        </a>
      </li>
    );
  }

  return (
    <li onClick={onClick}
         className={`${block}__item`}>
      {children}
    </li>
  );
}


export function ClickableList({children}) {
  return (
    <ul className={block}>
      {children}
    </ul>
  );
}


function stopPropagation(e) {
  e.stopPropagation();
}
