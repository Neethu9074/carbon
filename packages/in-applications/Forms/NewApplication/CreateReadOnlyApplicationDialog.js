/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment } from 'react';

import { Card, Message } from '@instana/components';

import { hasPermissionToAddBuiltInSmartAlerts } from 'in-alerting/smart-alerts/applications/apCreation/BuiltInGlobalSmartAlertsPermissionWrapper';
import ConfigTabBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/ConfigTabBuiltInSmartAlertsSelectionList';
import { createUserRestrictedApplication } from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import ContributionFilterDropdown from 'in-applications/creation/components/ContributionFilterDropdown';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { getApplicationConfigWithAlerting } from 'in-api/applicationConfigs';
import DescriptionText from 'in-components/form/DescriptionText';
import Steps from 'in-applications/Forms/components/Steps';
import { getColor } from 'in-applications/endpointTypes';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';
import Pill from 'in-components/Pill';
import { t, Trans } from 'in-i18n';

import locals from './CreateApplicationDialog.mless';

export default connectTo(
  props => ({
    appConfig: getApplicationConfigWithAlerting(props.applicationId)
  }),
  function CreateReadOnlyApplicationDialog({ appConfig }) {
    return (
      <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
        <Message type="neutral" className={locals.readOnlyMessage} withIcon small>
          {t('in-applications:forms.newApplication.readOnlyApplicationConfiguration')}
        </Message>
        <Card title={t('in-applications:titleApplicationPerspectiveConfiguration')}>
          <HelpText>{t('in-applications:forms.newApplication.helpApplicationPerspectives')}</HelpText>
          <Steps
            steps={[
              {
                stepTitle: t('in-applications:forms.newApplication.stepTitleApplicationName'),
                content: <Label>{appConfig.data?.label}</Label>
              },
              {
                stepTitle: t('in-applications:forms.newApplication.stepTitleDefineTags'),
                content: (
                  <Fragment>
                    <DescriptionText>
                      {appConfig.data && appConfig.data.contributionFilter ? (
                        <Trans i18nKey="in-applications:creation.advanced.defineUsingTagsContributionFilterDescription" />
                      ) : (
                        <Trans
                          i18nKey="in-applications:forms.newApplication.descriptionTags"
                          components={{
                            pillDatabase: <Pill color={getColor('DATABASE')} kind="light" />,
                            pillMessage: <Pill color={getColor('MESSAGING')} kind="light" />
                          }}
                        />
                      )}
                      <br />
                      <br />
                      <strong>{t('in-applications:forms.newApplication.descriptionOperatorsCreationEnabled')}</strong>
                    </DescriptionText>
                    <div className={locals.queryBuilder}>
                      {applicationContributionFilterEnabled && appConfig.data && appConfig.data.contributionFilter && (
                        <div className={locals.contributionFilter}>
                          <ContributionFilterDropdown
                            userRestrictedApplications={createUserRestrictedApplication(appConfig.data)}
                            className={locals.contributionFilterDropdownItem}
                            readonly
                          />
                        </div>
                      )}
                      <CreateApplicationQueryBuilder value={appConfig.data?.tagFilterExpression || []} readOnly />
                    </div>
                  </Fragment>
                )
              },
              {
                stepTitle: t('in-applications:forms.newApplication.stepTitleDownstreamServices'),
                content: (
                  <DescriptionText>
                    <Trans
                      i18nKey="in-applications:forms.newApplication.stepTitleApplicationUsesDownstreamServices"
                      values={{ scope: getScopeText(appConfig.data?.scope) }}
                    />
                  </DescriptionText>
                )
              },
              {
                stepTitle: t('in-applications:forms.newApplication.stepTitleApplicationScope'),
                content: (
                  <DescriptionText>
                    <Trans
                      i18nKey="in-applications:forms.newApplication.stepTitleApplicationUsesBoundaryScope"
                      values={{ boundaryScope: getBoundaryScopeText(appConfig.data?.boundaryScope) }}
                    />
                    <br />
                    {t('in-applications:inboundOutboundCalls.constants.inboundDashboard')}
                  </DescriptionText>
                )
              },
              hasPermissionToAddBuiltInSmartAlerts()
                ? {
                    stepTitle: t('in-applications:forms.newApplication.stepTitleBuiltInSmartAlertsScope'),
                    content:
                      appConfig.data?.builtInAlertIds.length > 0 ? (
                        <ConfigTabBuiltInSmartAlertsSelectionList
                          alertIds={appConfig.data?.builtInAlertIds}
                          applicationId={appConfig.id}
                          readOnly
                        />
                      ) : (
                        <DescriptionText>
                          {t('in-applications:forms.newApplication.noBuiltInSmartAlertsActive')}
                        </DescriptionText>
                      )
                  }
                : null
            ].filter(Boolean)}
          />
        </Card>
      </MaxWidthFullscreenContainer>
    );
  }
);

function getScopeText(scope) {
  if (scope === 'INCLUDE_NO_DOWNSTREAM') {
    return t('in-applications:forms.newApplication.optionNoDownstreamServices');
  } else if (scope === 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING') {
    return t('in-applications:forms.newApplication.optionImmediateDownstreamServices');
  } else if (scope === 'INCLUDE_ALL_DOWNSTREAM') {
    return t('in-applications:forms.newApplication.optionAllDownstreamServices');
  }

  return '';
}

function getBoundaryScopeText(boundaryScope) {
  if (boundaryScope === 'INBOUND') {
    return t('in-applications:inboundOutboundCalls.config.inbound.text');
  } else {
    return t('in-applications:inboundOutboundCalls.config.all.text');
  }
}
