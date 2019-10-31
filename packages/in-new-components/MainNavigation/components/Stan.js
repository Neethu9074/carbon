import React from 'react';

import StanImage from 'in-new-components/StanImage/StanImage';
import Lettering from 'in-components/Lettering';

import locals from './Stan.mless';

export default function Stan({ isExpanded }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.content} style={{ left: isExpanded ? -45 : 0 }}>
        <StanImage className={locals.stan} />
        <Lettering />
      </div>
    </div>
  );
}
