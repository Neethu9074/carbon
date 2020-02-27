import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Lettering from 'in-components/Lettering';
import SvgIcon from 'in-components/SvgIcon';

import locals from './StanV2.mless';

export default function StanV2({ isExpanded }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.wrapperExpanded]: isExpanded
      })}
    >
      <div className={locals.content} style={{ left: isExpanded ? -45 : 0 }}>
        <SvgIcon className={locals.icon} type="lib_navigation_stan" size="l" />
        <Lettering />
      </div>
    </div>
  );
}
