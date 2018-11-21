import React from 'react';

import locals from './MultiConfigView.mless';

export default function MultiConfigView({ viewSwitcher, configView }) {
  return (
    <div>
      <div className={locals.viewSwitcher}>{viewSwitcher}</div>
      <div className={locals.splitter} />
      <div className={locals.configView}>{configView}</div>
    </div>
  );
}
