import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './NoContentIcon.mless';

export default function NoContentIcon({ width, height }) {
  return (
    <div className={locals.noContentIconWrapper} style={{ width, height }}>
      <SvgIcon type="crossed_circle" height={64} color="#bec7cb" />
    </div>
  );
}
