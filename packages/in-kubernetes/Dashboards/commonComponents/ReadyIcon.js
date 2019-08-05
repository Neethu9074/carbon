import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ReadyIcon.mless';

export default function ReadyIcon({ isReady }) {
  return (
    <SvgIcon
      className={evaluateClassNames({
        [locals.isReady]: isReady,
        [locals.isNotReady]: !isReady
      })}
      type={isReady ? 'lib_check' : 'lib_openclose_cancel'}
    />
  );
}
