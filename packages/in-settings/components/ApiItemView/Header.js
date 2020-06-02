import React from 'react';

import { getView } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ parentPath, parentViewName }) {
  return (
    <div className={locals.header}>
      <BackToParentPathLink parentPath={parentPath} parentViewName={parentViewName} />
    </div>
  );
}

function BackToParentPathLink({ parentPath, parentViewName }) {
  if (!parentPath) {
    return <div />;
  }
  return (
    <div className={locals.backNavigationWrapper}>
      <SvgIcon className={locals.icon} type="lib_arrow_left" />
      <Link href$={getView(parentPath)}>{`Back to ${parentViewName}`}</Link>
    </div>
  );
}
