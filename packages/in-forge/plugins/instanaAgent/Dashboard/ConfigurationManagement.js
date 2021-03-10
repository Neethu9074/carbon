/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import connectTo from 'in-hoc/connectTo';
import { Trans, t } from 'in-i18n';

import locals from './ConfigurationManagement.mless';

export default connectTo({}, function ConfigurationManagement({ snapshot }) {
  if (snapshot.getIn(['data', 'git', 'present'])) {
    if (snapshot.getIn(['data', 'git', 'initialized'])) {
      return (
        <DescriptionList className={locals.list}>
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.dashboard.remoteName')}>
            {snapshot.getIn(['data', 'git', 'remoteName'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.dashboard.remoteBranch')}>
            {snapshot.getIn(['data', 'git', 'remoteBranch'])}
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.dashboard.remoteUri')}>
            <a href={snapshot.getIn(['data', 'git', 'remoteUri'])}>{snapshot.getIn(['data', 'git', 'remoteUri'])}</a>
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.dashboard.commitHash')}>
            <code>{snapshot.getIn(['data', 'git', 'commitHash'])}</code>
          </DescriptionItem>
          <DescriptionItem title={t('in-forge:plugins.instanaAgent.dashboard.commitMessage')}>
            {snapshot.getIn(['data', 'git', 'commitMessage'])}
          </DescriptionItem>
          {snapshot.getIn(['data', 'git', 'error']) ? (
            <p className={locals.error}>
              {t(
                'in-forge:plugins.instanaAgent.dashboard.gitBasedConfigurationManagementCouldNotBeStartedPleaseCheckTheAgentLogs'
              )}
            </p>
          ) : null}
        </DescriptionList>
      );
    } else {
      return <p>{t('in-forge:plugins.instanaAgent.dashboard.thisAgentDoesNotUseGitBasedConfigurationManagement')}</p>;
    }
  } else {
    return (
      <>
        <p>
          {t('in-forge:plugins.instanaAgent.dashboard.thisAgentIsTooOutdatedToSupportGitBasedConfigurationManagement')}
        </p>
        <p>
          <Trans i18nKey="in-forge:plugins.instanaAgent.dashboard.toUseGitBasedConfigurationManagementPleaseInstallAnAgentWithAtLeastBootstrapVersion" />
        </p>
      </>
    );
  }
});
