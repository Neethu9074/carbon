import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './SectionLine.mless';

export default function SectionLine({ withBottomMargin = true }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.line]: true,
        [locals.marginBottom]: withBottomMargin
      })}
    />
  );
}
