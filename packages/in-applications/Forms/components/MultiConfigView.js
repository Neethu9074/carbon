import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

import locals from './MultiConfigView.mless';

export default function MultiConfigView({ viewSwitcher, configView }) {
  return (
    <MaxWidthFullscreenContainer>
      <div className={locals.viewSwitcher}>{viewSwitcher}</div>
      <div className={locals.splitter} />
      <div className={locals.configView}>{configView}</div>
    </MaxWidthFullscreenContainer>
  );
}
