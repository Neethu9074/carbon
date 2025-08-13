/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Checkbox } from '@instana/components';
import { Spacer } from '@instana/components';

import BuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/BuiltInSmartAlertsSelectionBaseList';
import { getAllBuiltInGlobalSmartAlerts } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import AlertEnabledStateColumn from 'in-alerting/smart-alerts/applications/apCreation/AlertEnabledStateColumn';
import GoToAlertDetailsColumn from 'in-alerting/smart-alerts/applications/apCreation/GoToAlertDetailsColumn';
import SeverityColumn from 'in-alerting/smart-alerts/components/list/columns/SeverityColumn';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function DialogBuiltInSmartAlertsSelectionList({
  onChange,
  alertIds = [],
  getBuiltInAlerts = getAllBuiltInGlobalSmartAlerts({ asObservable: true })
}) {
  const builtInAlerts = useObservable(getBuiltInAlerts, []) ?? pendingResult;

  return (
    <BuiltInSmartAlertsSelectionBaseList
      alertConfigsResult={builtInAlerts}
      columnDefinitions={getColumnDefinitions(onChange)}
      onItemSelect={(selected, alertId) => {
        onChange(selected ? alertIds.concat(alertId) : alertIds.filter(id => id !== alertId));
      }}
      alertIds={alertIds}
    />
  );
}

function getColumnDefinitions() {
  return [
    {
      id: 'id1',
      verticallyCenter: true,
      getContent(config, onItemSelect, alertIds, index) {
        return (
          <Checkbox
            id={`select-built-in-alert${index}`}
            name={`select-built-in-alert${index}`}
            size="large"
            onChange={e => {
              onItemSelect(e.target.checked, config?.id);
            }}
            checked={alertIds.includes(config?.id)}
          />
        );
      }
    },
    {
      id: 'id2',
      verticallyCenter: true,
      label: t('in-alerting:smartAlerts.list.columns.name'),
      getContent(config) {
        return config.name;
      }
    },
    {
      id: 'id3',
      width: 'max-content',
      verticallyCenter: true,
      label: t('in-alerting:smartAlerts.list.columns.severity'),
      getContent(config) {
        const { rules } = config;
        const warningThreshold = rules?.[0].thresholds?.WARNING;
        const criticalThreshold = rules?.[0].thresholds?.CRITICAL;
        return <SeverityColumn warningThreshold={warningThreshold} criticalThreshold={criticalThreshold} />;
      }
    },
    {
      id: 'id4',
      width: 'max-content',
      verticallyCenter: true,
      label: t('in-alerting:smartAlerts.list.columns.status'),
      getContent(config) {
        return (
          <>
            <AlertEnabledStateColumn {...config} />
            <Spacer horizontal="normal" />
          </>
        );
      }
    },
    {
      id: 'id5',
      width: 'max-content',
      label: t('in-alerting:smartAlerts.list.columns.action'),
      verticallyCenter: true,
      getContent(config) {
        return <GoToAlertDetailsColumn {...config} />;
      }
    }
  ];
}

DialogBuiltInSmartAlertsSelectionList.propTypes = {
  onChange: PropTypes.func,
  alertIds: PropTypes.arrayOf(PropTypes.string),
  getBuiltInAlerts: PropTypes.func
};
