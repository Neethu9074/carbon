import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './HeaderToggleIcon.mless';

export default function HeaderToggleIcon({ expanded, setExpanded }) {
  return (
    <Tooltip content={expanded ? 'Show less' : 'Show more'}>
      <SvgIcon
        className={locals.icon}
        type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          setExpanded(!expanded);
        }}
        width={20}
        height={20}
      />
    </Tooltip>
  );
}
