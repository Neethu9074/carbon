import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Skeleton.mless';

export default function SkeletonCellContent(props) {
  return <span {...props} className={joinClassNames(locals.skeleton, props.className)} />;
}
