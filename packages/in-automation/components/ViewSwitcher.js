/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { automation } from 'in-automation/navigation/paths';
import SearchBar from 'in-components/SearchBar';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher({ actionContext }) {
  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, automation, 'view', 'plans'))}
          label={t('in-automation:actionPlans')}
          isActive={actionContext === 'plans'}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, automation, 'view', 'catalog'))}
          label={t('in-automation:actionCatalog')}
          isActive={actionContext === 'catalog'}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, automation, 'view', 'sources'))}
          label={t('in-automation:actionSources')}
          isActive={actionContext === 'sources'}
          darkTheme
        />
      </SecondLevelNavigation>

      <SearchBar theme="light" />
    </div>
  );
}
