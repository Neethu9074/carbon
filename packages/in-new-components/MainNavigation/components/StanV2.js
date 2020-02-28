import React from 'react';

import Lettering from 'in-components/Lettering';
import SvgIcon from 'in-components/SvgIcon';

import locals from './StanV2.mless';

export default function StanV2() {
  return (
    <div className={locals.wrapper}>
      <div className={locals.content}>
        <SvgIcon className={locals.icon} type="lib_navigation_stan" size="l" />
        <Lettering />
      </div>
    </div>
  );
}
