import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import './FullscreenViewHeading.less';

const block = 'in-fullscreen-view-heading';

export default function FullscreenViewHeading({ iconType, children, count, className, iconClassName }) {
  return (
    <div className={joinClassNames(block, className)}>
      <SvgIcon className={joinClassNames(`${block}__icon`, iconClassName)} type={iconType} width={26} height={26} />
      <h2 className={`${block}__title`}>{children}</h2>
      {count != null ? <span className={`${block}__counter`}>{` (${number.compact(count)})`}</span> : null}
    </div>
  );
}
