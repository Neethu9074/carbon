import React from 'react';

import locals from './GraphExplorer.mless';

export default function GraphExplorer({ snapshot }) {
  console.log(snapshot.toJS());
  const dependencies = snapshot.get('dependencies');
  return (
    <div className={locals.map}>
      {dependencies.map((dependency, i) => (
        <div key={i}>{`${dependency.get('direction')}  ${dependency.get('type')}: ${dependency.get('key')}`}</div>
      ))}
    </div>
  );
}
