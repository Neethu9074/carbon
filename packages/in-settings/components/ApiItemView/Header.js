/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './Header.mless';

export default function Header({ parentPath, parentViewName }) {
  return (
    <div className={locals.header}>
      <BackToParentPathLink parentPath={parentPath} parentViewName={parentViewName} />
    </div>
  );
}

function BackToParentPathLink({ parentPath, parentViewName }) {
  const { createHrefToPath } = useNavigation();

  if (!parentPath) {
    return <div />;
  }
  return (
    <Link className={locals.backNavigationWrapper} href={createHrefToPath(parentPath)}>
      <SvgIcon className={locals.icon} type="lib_arrow_left" />
      {t('in-settings:components.backToParentViewName', { parentViewName: parentViewName })}
    </Link>
  );
}
