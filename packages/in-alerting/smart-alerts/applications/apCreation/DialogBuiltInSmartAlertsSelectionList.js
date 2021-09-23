/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Spacer } from '@instana/components';

import BuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/BuiltInSmartAlertsSelectionBaseList';
import { getAllBuiltInGlobalSmartAlerts } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import AlertEnabledStateColumn from 'in-alerting/smart-alerts/applications/apCreation/AlertEnabledStateColumn';
import GoToAlertDetailsColumn from 'in-alerting/smart-alerts/applications/apCreation/GoToAlertDetailsColumn';
import MainColumn from 'in-alerting/smart-alerts/applications/apCreation/MainColumn';
import { pendingResult } from 'in-services/fixedObjects';

export default function DialogBuiltInSmartAlertsSelectionList({
  onChange,
  alertIds = [],
  getBuiltInAlerts = getAllBuiltInGlobalSmartAlerts({ asObservable: true })
}) {
  const builtInAlerts = useObservable(getBuiltInAlerts, []) ?? pendingResult;

  return (
    <BuiltInSmartAlertsSelectionBaseList
      alertConfigsResult={builtInAlerts}
      columnDefinitions={getColumnDefinitions()}
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
      getContent({ config, onItemSelect, alertIds, index }) {
        return (
          <MainColumn
            {...config}
            alertIds={alertIds}
            onItemSelect={selected => onItemSelect(selected, config.id)}
            index={index}
          />
        );
      }
    },
    {
      id: 'id2',
      width: 'max-content',
      verticallyCenter: true,
      getContent({ config }) {
        return (
          <>
            <AlertEnabledStateColumn {...config} />
            <Spacer horizontal="normal" />
          </>
        );
      }
    },
    {
      id: 'id3',
      width: 'max-content',
      verticallyCenter: true,
      getContent({ config }) {
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
