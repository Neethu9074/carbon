import React from 'react';

import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import './FullscreenViewHeading.less';

const block = 'in-fullscreen-view-heading';

export default function FullscreenViewHeading({ iconType, children, count }) {
  return (
    <div className={block}>
      <SvgIcon className={`${block}__icon`} type={iconType} width={26} color="#172429" />
      <h2 className={`${block}__title`}>{children}</h2>
      {count != null ? <span className={`${block}__counter`}>{` (${number.compact(count)})`}</span> : null}
    </div>
  );
}
