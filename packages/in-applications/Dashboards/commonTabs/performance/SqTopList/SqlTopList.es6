import React from 'react';

import SqlToplistRow from './SqlTopListRow';

import locals from './SqlTopList.mless';

export default function SqlTopList({ data, header }) {
  return (
    <div className={locals.sqlTopList}>
      <h3>{header}</h3>
      <ol>{data.map(data => <SqlToplistRow {...data} />)}</ol>
    </div>
  );
}
