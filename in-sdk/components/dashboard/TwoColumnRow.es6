import React from 'react';

import './TwoColumnRow.less';

const block = 'in-dashboard-two-column-row';

export default function TwoColumnRow({ children }) {
  children = React.Children.toArray(children).filter(child => !!child);
  const count = children.length;
  if (count === 0) {
    return null;
  } else if (count === 1) {
    return children[0];
  } else if (__DEV__ && count > 2) {
    throw new Error('Two columns rows may have at most two children.');
  }

  return (
    <div className={block}>
      <div className={`${block}__left`}>
        {children[0]}
      </div>
      <div className={`${block}__right`}>
        {children[1]}
      </div>
    </div>
  );
}
