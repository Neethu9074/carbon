/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { just } from '@instana/observables';

import AlertBaseList from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import ViewSwitcher from 'in-logging/analyze/AnalyzeView/ViewSwitcher';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import { success } from 'in-services/util/result';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function Alerts() {
  return (
    <>
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
        <AlertBaseList<any>
          extraColumnDefinitions={[]}
          getAlertConfigs={() => just(success([]))}
          getSubtitle={() => ''}
          alertsTab=""
        />
      </Sticky>
    </>
  );
}
