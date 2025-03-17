/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment } from 'react';

import {
  Card,
  Message,
  Link,
  Pill,
  Typography,
  CarbonFormGroup as FormGroup,
  CarbonStack as Stack
} from '@instana/components';
import { LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { hasPermissionToAddBuiltInSmartAlerts } from 'in-alerting/smart-alerts/applications/apCreation/BuiltInGlobalSmartAlertsPermissionWrapper';
import ConfigTabBuiltInSmartAlertsSelectionList from 'in-alerting/smart-alerts/applications/apCreation/ConfigTabBuiltInSmartAlertsSelectionList';
import { createUserRestrictedApplication } from 'in-applications/Forms/NewApplication/CreateApplicationDialog';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import ContributionFilterDropdown from 'in-applications/creation/components/ContributionFilterDropdown';
import { getGroupInfoByRestrictingApplicationId } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { securityAndAccessAccessControlGroups } from 'in-settings/navigation/paths';
import { getApplicationConfigWithAlerting } from 'in-api/applicationConfigs';
import { hasError, isLoading } from 'in-services/util/result';
import Steps from 'in-applications/Forms/components/Steps';
import { pendingResult } from 'in-services/fixedObjects';
import { getColor } from 'in-applications/endpointTypes';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from './CreateApplicationDialog.mless';

export default function CreateReadOnlyApplicationDialog({ applicationId }) {
  const appConfig = useObservable(getApplicationConfigWithAlerting(applicationId), [applicationId]) ?? pendingResult;
  const isRestrictingApplication = appConfig.data?.restrictingApplication;
  const canConfigureRestrictingApplication = isRestrictingApplication && role.canConfigureTeams;
  const groupInfo =
    useObservable(
      canConfigureRestrictingApplication ? getGroupInfoByRestrictingApplicationId(appConfig.data?.id) : null,
      [canConfigureRestrictingApplication]
    ) ?? pendingResult;
  const groupInfoLoading = isLoading(groupInfo) || hasError(groupInfo);
  const groupId = groupInfo?.found?.id;

  return (
    <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
      <Stack gap={4}>
        <Message type="neutral" fullInlineWidth>
          {appConfig.data &&
            (!isRestrictingApplication ? (
              t('in-applications:forms.newApplication.readOnlyApplicationConfiguration')
            ) : canConfigureRestrictingApplication && groupInfoLoading ? (
              <LoadingSkeleton className={locals.loadingSkeleton} />
            ) : (
              <Trans
                i18nKey="in-applications:forms.newApplication.readOnlyRestrictingApplication"
                values={{
                  groupConfigLabel: t('in-applications:forms.newApplication.accessConfiguration')
                }}
                components={{
                  bold: <span className={locals.bold} />,
                  linkToGroupConfig: groupId ? (
                    <Link href={`#${securityAndAccessAccessControlGroups}/${groupId}`} />
                  ) : (
                    <></>
                  )
                }}
              />
            ))}
        </Message>
        <Card title={t('in-applications:titleApplicationPerspectiveConfiguration')}>
          <FormGroup legendText={t('in-applications:forms.newApplication.helpApplicationPerspectives')}>
            <Steps
              steps={[
                {
                  stepTitle: t('in-applications:forms.newApplication.stepTitleApplicationName'),
                  content: <Typography variant="label-01">{appConfig.data?.label}</Typography>
                },
                {
                  stepTitle: t('in-applications:forms.newApplication.stepTitleDefineTags'),
                  content: (
                    <Stack>
                      <Typography variant="label-01">
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
                      </Typography>
                      <Typography variant="heading-compact-01">
                        {t('in-applications:forms.newApplication.descriptionOperatorsCreationEnabled')}
                      </Typography>
                      {appConfig.data && appConfig.data.contributionFilter && (
                        <div className={locals.contributionFilter}>
                          <ContributionFilterDropdown
                            userRestrictedApplications={createUserRestrictedApplication(appConfig.data)}
                            className={locals.contributionFilterDropdownItem}
                            readonly
                          />
                        </div>
                      )}
                      {appConfig.data?.tagFilterExpression?.length > 0 && (
                        <CreateApplicationQueryBuilder value={appConfig.data?.tagFilterExpression || []} readOnly />
                      )}
                    </Stack>
                  )
                },
                {
                  stepTitle: t('in-applications:forms.newApplication.stepTitleDownstreamServices'),
                  content: (
                    <Typography variant="label-01">
                      <Trans
                        i18nKey="in-applications:forms.newApplication.stepTitleApplicationUsesDownstreamServices"
                        values={{ scope: getScopeText(appConfig.data?.scope) }}
                      />
                    </Typography>
                  )
                },
                {
                  stepTitle: t('in-applications:forms.newApplication.stepTitleApplicationScope'),
                  content: (
                    <Typography variant="label-01">
                      <Trans
                        i18nKey="in-applications:forms.newApplication.stepTitleApplicationUsesBoundaryScope"
                        values={{ boundaryScope: getBoundaryScopeText(appConfig.data?.boundaryScope) }}
                      />
                      <br />
                      {t('in-applications:inboundOutboundCalls.constants.inboundDashboard')}
                    </Typography>
                  )
                },
                hasPermissionToAddBuiltInSmartAlerts()
                  ? {
                      stepTitle: t('in-applications:forms.newApplication.stepTitleBuiltInSmartAlertsScope'),
                      content:
                        appConfig.data?.builtInAlertIds?.length > 0 ? (
                          <ConfigTabBuiltInSmartAlertsSelectionList
                            alertIds={appConfig.data?.builtInAlertIds}
                            applicationId={appConfig.id}
                            readOnly
                          />
                        ) : (
                          <Typography variant="label-01">
                            {t('in-applications:forms.newApplication.noBuiltInSmartAlertsActive')}
                          </Typography>
                        )
                    }
                  : null
              ].filter(Boolean)}
            />
          </FormGroup>
        </Card>
      </Stack>
    </MaxWidthFullscreenContainer>
  );
}

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
