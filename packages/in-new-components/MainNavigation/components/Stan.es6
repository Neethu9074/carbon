import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Lettering from 'in-components/Lettering';

import locals from './Stan.mless';

export default function Stan({ isExpanded }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.expandedWrapper]: isExpanded
      })}
    >
      <div className={locals.content} style={{ left: isExpanded ? -45 : 0 }}>
        <div className={locals.stan} />
        <Lettering />
      </div>
    </div>
  );
}
