/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import React from 'react';

import { Link, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import BuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/BuiltInSmartAlertsSelectionBaseList';
import { getAllBuiltInGlobalSmartAlerts } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import AlertEnabledStateColumn from 'in-alerting/smart-alerts/applications/apCreation/AlertEnabledStateColumn';
import MainColumn from 'in-alerting/smart-alerts/applications/apCreation/MainColumn';
import LabelText from 'in-alerting/smart-alerts/applications/apCreation/LabelText';
import { getLinkToAlertDetails } from './navigation/paths';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function ConfigTabBuiltInSmartAlertsSelectionList({
  onChange,
  alertIds = [],
  getBuiltInAlerts = getAllBuiltInGlobalSmartAlerts({ asObservable: true }),
  applicationId
}) {
  const builtInAlerts = useObservable(getBuiltInAlerts, []) ?? pendingResult;

  return (
    <BuiltInSmartAlertsSelectionBaseList
      alertConfigsResult={builtInAlerts}
      columnDefinitions={columnDefinitions}
      onItemSelect={(selected, alertId) => {
        onChange(selected ? alertIds.concat(alertId) : alertIds.filter(id => id !== alertId));
      }}
      alertIds={alertIds}
      applicationId={applicationId}
    />
  );
}

const columnDefinitions = [
  {
    id: 'id1',
    verticallyCenter: true,
    getContent({ config, onItemSelect, alertIds, applicationId }) {
      const isPartiallySelected = hasPartialEnitySelection(config.applications, applicationId);
      return (
        <MainColumn
          {...config}
          alertIds={alertIds}
          onItemSelect={selected => onItemSelect(selected, config.id)}
          customLabel={() => (
            <Stack gap="xxsmall">
              <Link
                href$={getLinkToAlertDetails(config)}
                aria-label={t('in-alerting:smartAlerts.applications.apCreation.viewAlertDetails', {
                  name: config.name
                })}
                external
              >
                {config.name}
              </Link>
              {isPartiallySelected && (
                <LabelText asSubText>
                  {t('in-alerting:smartAlerts.applications.apCreation.notAllEnitiesSelected')}
                </LabelText>
              )}
            </Stack>
          )}
          isIndeterminate={isPartiallySelected}
          disabled={isPartiallySelected}
        />
      );
    }
  },
  {
    id: 'id2',
    width: 'max-content',
    verticallyCenter: true,
    getContent({ config }) {
      return <AlertEnabledStateColumn {...config} />;
    }
  }
];

function hasPartialEnitySelection(applications, applicationId) {
  const { inclusive, services } = Object.values(applications).find(app => app.applicationId === applicationId) ?? {};
  return inclusive != null && services && (!inclusive || !isEmpty(services));
}

ConfigTabBuiltInSmartAlertsSelectionList.propTypes = {
  onChange: PropTypes.func,
  alertIds: PropTypes.arrayOf(PropTypes.string),
  getBuiltInAlerts: PropTypes.func,
  applicationId: PropTypes.string
};
