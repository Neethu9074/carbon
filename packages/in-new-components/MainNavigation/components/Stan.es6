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
        {!isExpanded ? <div className={locals.stan} /> : <div className={locals.stanPlaceHolder} />}
        {isExpanded && <Lettering />}
      </div>
    </div>
  );
}
