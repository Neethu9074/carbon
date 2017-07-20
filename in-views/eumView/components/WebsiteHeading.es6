import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './WebsiteHeading.less';

const block = 'in-website-heading';

export default function WebsiteHeading({ numWebsites = 0 }) {
  return (
    <div className={block}>
      <SvgIcon className={`${block}__icon`} type="traces" width={26} color="#172429" />
      <h2 className={`${block}__title`}>Websites{`${numWebsites > 0 ? ' (' + numWebsites + ')' : ''}`}</h2>
    </div>
  );
}
