import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Checkmark.mless';

export default function Checkmark() {
  return <SvgIcon type="lib_check" width={24} className={locals.icon} />;
}
