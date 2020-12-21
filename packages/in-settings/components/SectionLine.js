import React from 'react';

import classNames from 'classnames';

import locals from './SectionLine.mless';

export default function SectionLine({ withBottomMargin = true }) {
  return (
    <div
      className={classNames({
        [locals.line]: true,
        [locals.marginBottom]: withBottomMargin
      })}
    />
  );
}
