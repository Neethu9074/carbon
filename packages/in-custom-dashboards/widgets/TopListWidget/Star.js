import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Star.mless';

export default function Star({ pinned, pinItem, unpinItem, item }) {
  return (
    <SvgIcon
      className={pinned ? locals.starIconFilled : locals.starIcon}
      type={pinned ? 'lib_actions_star_filled' : 'lib_actions_star'}
      onClick={() => (pinned ? unpinItem : pinItem)(item)}
    />
  );
}
