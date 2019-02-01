import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './Section.less';

const block = 'in-config-view-section';

export default function Section({ children, className }) {
  return <div className={joinClassNames(block, className)}>{children}</div>;
}
