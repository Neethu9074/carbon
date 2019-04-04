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
      <div className={locals.content} style={{ left: isExpanded ? -29 : 0 }}>
        <div className={locals.stan} />
        {isExpanded && <Lettering />}
      </div>
    </div>
  );
}
