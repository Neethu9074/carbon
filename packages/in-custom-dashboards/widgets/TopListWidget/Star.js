import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Star.mless';

export default function Star({ pinned, onClick }) {
  return (
    <SvgIcon
      className={pinned ? locals.starIconFilled : locals.starIcon}
      type={pinned ? 'lib_actions_star_filled' : 'lib_actions_star'}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
    />
  );
}
