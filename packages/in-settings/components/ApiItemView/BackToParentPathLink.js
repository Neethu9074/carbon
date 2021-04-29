/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { getView } from 'in-stores/navigation';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './BackToParentPathLink.mless';

export default function BackToParentPathLink({ parentPath, parentViewName }) {
  if (!parentPath) {
    return null;
  }

  return (
    <div className={locals.backNavigationWrapper}>
      <SvgIcon className={locals.icon} type="lib_arrow_left" />
      <Link href$={getView(parentPath)}>
        {t('in-settings:components.backToParentViewName', { parentViewName: parentViewName })}
      </Link>
    </div>
  );
}
