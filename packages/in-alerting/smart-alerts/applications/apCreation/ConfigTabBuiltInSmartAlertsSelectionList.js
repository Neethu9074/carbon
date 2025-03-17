/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import React from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import ReadOnlyBuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/ReadOnlyBuiltInSmartAlertsSelectionBaseList';
import BuiltInSmartAlertsSelectionBaseList from 'in-alerting/smart-alerts/applications/apCreation/BuiltInSmartAlertsSelectionBaseList';
import { getAllBuiltInGlobalSmartAlerts } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import AlertEnabledStateColumn from 'in-alerting/smart-alerts/applications/apCreation/AlertEnabledStateColumn';
import { useLinkToAlertDetails } from 'in-alerting/smart-alerts/applications/apCreation/navigation/paths';
import MainColumn from 'in-alerting/smart-alerts/applications/apCreation/MainColumn';
import LabelText from 'in-alerting/smart-alerts/applications/apCreation/LabelText';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './MainColumn.mless';

export default function ConfigTabBuiltInSmartAlertsSelectionList({
  onChange,
  alertIds = [],
  getBuiltInAlerts = getAllBuiltInGlobalSmartAlerts({ asObservable: true }),
  applicationId,
  readOnly = false
}) {
  const builtInAlerts = useObservable(getBuiltInAlerts, []) ?? pendingResult;

  if (readOnly) {
    return (
      <ReadOnlyBuiltInSmartAlertsSelectionBaseList
        alertConfigsResult={builtInAlerts}
        columnDefinitions={readOnlyColumnDefinitions}
        alertIds={alertIds}
        applicationId={applicationId}
      />
    );
  }

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

function MainColumnContent({ config, applicationId, alertIds, onItemSelect, index }) {
  const getLinkToAlertDetails = useLinkToAlertDetails();
  const isPartiallySelected = hasPartialEnitySelection(config.applications, applicationId);

  return (
    <MainColumn
      {...config}
      alertIds={alertIds}
      onItemSelect={selected => onItemSelect(selected, config.id)}
      index={index}
      customLabel={() => (
        <Stack gap="xxsmall">
          <Link
            href={getLinkToAlertDetails(config)}
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

const columnDefinitions = [
  {
    id: 'id1',
    verticallyCenter: true,
    getContent({ config, onItemSelect, alertIds, applicationId, index }) {
      return (
        <MainColumnContent
          config={config}
          applicationId={applicationId}
          alertIds={alertIds}
          onItemSelect={onItemSelect}
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
      return <AlertEnabledStateColumn {...config} />;
    }
  }
];

function ReadOnlyMainColumnContent({ config, applicationId }) {
  const getLinkToAlertDetails = useLinkToAlertDetails();
  const isPartiallySelected = hasPartialEnitySelection(config.applications, applicationId);
  const isWarning = config.severity <= 5;

  return (
    <Stack gap="xsmall" direction="horizontal" align="center">
      <SvgIcon
        className={classNames({
          [locals.iconWarning]: isWarning,
          [locals.iconCritical]: !isWarning
        })}
        type={isWarning ? 'lib_events_warning' : 'lib_events_critical'}
        aria-label={
          isWarning
            ? t('in-alerting:smartAlerts.applications.apCreation.eventsWarningIcon')
            : t('in-alerting:smartAlerts.applications.apCreation.eventsCriticalIcon')
        }
      />
      {
        // This has been added back in 2021 and my not really be needed?
        // eslint-disable-next-line no-undef
        <div className={locals.labelTextWrapper}>{config.customLabel?.() ?? <LabelText>{name}</LabelText>}</div>
      }
      <Link
        href={getLinkToAlertDetails(config)}
        aria-label={t('in-alerting:smartAlerts.applications.apCreation.viewAlertDetails', {
          name: config.name
        })}
        external
      >
        {config.name}
      </Link>
      {isPartiallySelected && (
        <LabelText asSubText>{t('in-alerting:smartAlerts.applications.apCreation.notAllEnitiesSelected')}</LabelText>
      )}
    </Stack>
  );
}

const readOnlyColumnDefinitions = [
  {
    id: 'id1',
    verticallyCenter: true,
    getContent({ config, applicationId }) {
      return <ReadOnlyMainColumnContent config={config} applicationId={applicationId} />;
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
  applicationId: PropTypes.string,
  readOnly: PropTypes.bool
};
