import React from 'react';

import locals from './Group.mless';

export default function Group({ name, onClick }) {
  return (
    <div className={locals.group} onClick={onClick}>
      {name}
    </div>
  );
}
