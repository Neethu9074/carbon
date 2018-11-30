import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import locals from './KeyValueHeader.mless';

export default function KeyValueHeader({ label, value, onClick }) {
  return (
    <div className={locals.header}>
      <span className={locals.key}>{label}</span>
      {onClick && (
        <a
          href=""
          onClick={e => {
            stopPropagationAndPreventDefault(e);
            onClick();
          }}
          className={locals.valueLink}
        >
          {value}
        </a>
      )}
      {!onClick && <span className={locals.value}>{value}</span>}
    </div>
  );
}
