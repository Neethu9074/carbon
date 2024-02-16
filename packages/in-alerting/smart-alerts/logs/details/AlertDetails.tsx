/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/logs/api/logAlertConfig';
import {
  alertsDetailsPath as alertsTabSegment,
  alertDetailsFullyQualifiedPath as detailsPath,
  alertsFullyQualifiedPath as listPath
} from 'in-logging/navigation/paths';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-logging/navigation/matrix';
import AlertConfiguration from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import ViewSwitcher from 'in-logging/analyze/AnalyzeView/ViewSwitcher';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { LogAlertConfigWithMetadata } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function AlertDetails() {
  const timeConfig = useTimeConfig();
  return (
    <Sticky
      header={
        <>
          <AnalyzeHeader
            isGrouped={false}
            liveModeDisabled
            liveModeDisabledTooltip={t('in-logging:liveModeDisabled')}
            withoutShadow
          />
          <ViewSwitcher />
        </>
      }
      backgroundColor={themes.default.ids.color.option.white}
    >
      <LeftRightPadding>
        <Alert
          timeConfig={timeConfig}
          paths={{
            detailsPath,
            listPath,
            alertsTabSegment
          }}
          matrix={{ alertIdParam, alertCreatedParam }}
          getConfig={(id: string, created: number) =>
            created ? getAlertConfigByIdAndTimestamp(id, created) : getLatestAlertConfig(id)
          }
          getConfigVersions={(id: string) => getAllVersionsOfAlertConfig(id)}
          enableConfig={enableAlertConfig}
          disableConfig={disableAlertConfig}
          deleteConfig={deleteAlertConfig}
          restoreConfig={restoreAlertConfigVersion}
          renderSmartAlertDialog={() => <></>}
          renderAlertConfiguration={renderAlertConfiguration}
          getAllowedPlaceholders={() => []}
          isGlobalSmartAlert
          //permission  need to be changed to logging specific in follow PRs, once available in global.d.ts.
          canConfigureGlobalAlertConfigs={role?.canConfigureGlobalInfraSmartAlerts}
          displayEditAction={false}
          displayDuplicateAction={false}
        />
      </LeftRightPadding>
    </Sticky>
  );
}
function renderAlertConfiguration({ alertConfig }: { alertConfig: LogAlertConfigWithMetadata }) {
  return <AlertConfiguration alertConfig={alertConfig} />;
}
