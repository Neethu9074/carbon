import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './WebsiteHeading.less';

const block = 'in-website-heading';

export default function WebsiteHeading({ numWebsites = 0 }) {
  return (
    <div className={block}>
      <SvgIcon className={`${block}__icon`} type="globe" width={26} color="#172429" />
      <h2 className={`${block}__title`}>Websites</h2>
      {numWebsites > 0 ? <span className={`${block}__counter`}>{` (${numWebsites})`}</span> : null}
    </div>
  );
}
