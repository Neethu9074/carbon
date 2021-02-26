/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
    <Link className={locals.backNavigationWrapper} href$={getView(parentPath)}>
      <SvgIcon className={locals.icon} type="lib_arrow_left" />
      {t('in-settings:components.backToParentViewName', { parentViewName: parentViewName })}
    </Link>
  );
}
