/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { userSettings, teamSettings } from 'in-settings/navigation/paths';
import { getView } from 'in-stores/navigation';
import Title from 'in-components/Title';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export default function NotFoundPage() {
  return (
    <Fragment>
      <Title>{t('in-settings:tabs.notFound')}</Title>
      <h1>{t('in-settings:tabs.settingsPageNotFound')}</h1>
      <p>{t('in-settings:tabs.weCouldNotFindTheSettingsPageYouWereLookingFor')}</p>
      <ul>
        <li>
          <Link href$={getView(teamSettings)}>{t('in-settings:tabs.teamSettings')}</Link>
        </li>
        <li>
          <Link href$={getView(userSettings)}>{t('in-settings:tabs.userSettings')}</Link>
        </li>
      </ul>
    </Fragment>
  );
}
