/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Link } from '@instana/components';

import { userSettings, globalSettings } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function NotFoundPage() {
  const { createHrefToPath } = useNavigation();
  return (
    <Fragment>
      <Title>{t('in-settings:tabs.notFound')}</Title>
      <h1>{t('in-settings:tabs.settingsPageNotFound')}</h1>
      <p>{t('in-settings:tabs.weCouldNotFindTheSettingsPageYouWereLookingFor')}</p>
      <ul>
        <li>
          <Link size="sm" href={createHrefToPath(globalSettings)}>
            {t('in-settings:tabs.globalSettings')}
          </Link>
        </li>
        <li>
          <Link size="sm" href={createHrefToPath(userSettings)}>
            {t('in-settings:tabs.userSettings')}
          </Link>
        </li>
      </ul>
    </Fragment>
  );
}
