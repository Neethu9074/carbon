import React from 'react';

import { getView } from 'in-stores/navigation';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ onSaveClick, parentPath, parentViewName }) {
  return (
    <div className={locals.header}>
      <BackToParentPathLink parentPath={parentPath} parentViewName={parentViewName} />
      {onSaveClick && (
        <div className={locals.customControls}>{onSaveClick && <Button onClick={onSaveClick}>Save</Button>}</div>
      )}
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
