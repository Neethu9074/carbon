import { compose, withState } from 'recompose';
import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './BetaMarker.mless';

export default compose(withState('expanded', 'setExpanded'))(BetaMarker);

function BetaMarker({ title, children, expanded, setExpanded }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.betaMarker}>
        <div className={locals.header} onClick={() => setExpanded(!expanded)}>
          <h1 className={locals.headerTitle}>{title}</h1>
          <div className={locals.headerIcon}>
            <SvgIcon
              className={locals.arrowIcon}
              type={expanded ? 'lib_arrow_expand_down' : 'lib_arrow_expand_up'}
              width={16}
              height={16}
            />
          </div>
        </div>
        {expanded && <div className={locals.body}>{children}</div>}
      </div>
    </div>
  );
}
