import React from 'react';

import './PropList.less';

const block = 'in-prop-list';

export default function PropList({children, className}) {
  return (
    <dl className={className ? block + ' ' + className : block}>
      {children}
    </dl>
  );
}

PropList.Prop = function Prop({label, value, note}) {
  return (
    <div className={block + '__wrapper'}>
      <dt className={block + '__label'}>{label}</dt>
      <dd className={block + '__value'}>{value}</dd>
      {note ?
        <span className={block + '__note'}>
          ({note})
        </span>
      : null}
    </div>
  );
};
