/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import React, { useState } from 'react';

import {
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig,
  updateAlertConfig
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import {
  applicationsAlertingAlertRevisionChanged,
  applicationsAlertingAlertEdit,
  applicationsAlertingAlertPaused,
  applicationsAlertingAlertResumed,
  applicationsAlertingAlertDeleted
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  alertsList,
  alertsTabDetailsFullyQualified,
  alertsTabListFullyQualified,
  globalAlertDetails
} from 'in-applications/navigation/paths';
import {
  alertsCategoryMatrixParam,
  categoryGlobal
} from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { getLatestGlobalAlertConfig } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import AlertConfiguration from 'in-applications/Dashboards/application/tabs/Alerts/AlertConfiguration';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import getApplication from 'in-subscription/application/getApplication';
import AlertHistoryList from 'in-alerting/components/AlertHistoryList';
import AlertHeader from 'in-alerting/components/AlertHeader';
import { alertsTab } from 'in-applications/navigation/paths';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import SetBodyColor from 'in-components/SetBodyColor';
import Footer from 'in-new-components/Footer/Footer';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

function getAlertConfig(id, created) {
  return created ? getAlertConfigByIdAndTimestamp(id, created) : getLatestAlertConfig(id);
}

export default function Alert({ location, timeConfig }) {
  const alertConfigId = getMatrixParameter(location, alertsTab, alertIdMatrixParam);
  const alertConfigCreated = getMatrixParameter(location, alertsTab, alertCreatedMatrixParam);
  const isGlobalAlertConfig = getMatrixParameter(location, alertsTab, alertsCategoryMatrixParam) === categoryGlobal;

  const alertConfig$ = isGlobalAlertConfig
    ? getLatestGlobalAlertConfig(alertConfigId)
    : getAlertConfig(alertConfigId, alertConfigCreated);
  const alertConfigVersions$ = getAllVersionsOfAlertConfig(alertConfigId).startWith(null);

  const [reload, triggerReload] = useState(undefined);
  const alertConfig = useObservable(alertConfig$.startWith(null), [alertConfigId, alertConfigCreated, reload]);
  const alertConfigError = useObservable(alertConfig$.errors(), [alertConfigId, alertConfigCreated]);
  const alertConfigVersions = useObservable(alertConfigVersions$, [alertConfigId, reload]);

  const alertConfigVersionsError = useObservable(alertConfigVersions$.errors(), [alertConfigId]);

  const applicationName =
    useObservable(
      isGlobalAlertConfig
        ? just(null)
        : alertConfig$.flatMap(({ applicationId }) =>
            getApplication({ id: applicationId }).map(({ data }) => data && data.label)
          ),
      [alertConfigId, alertConfigCreated]
    ) ?? '';

  if (alertConfigError || alertConfigVersionsError) {
    return <ErroneousResultPresenter errors={[alertConfigError, alertConfigVersionsError].filter(Boolean)} />;
  } else if (!alertConfig || !alertConfigVersions) {
    return <DefaultLoadingDashboard />;
  }

  function setRevision(created) {
    mutateUrl(location => {
      location.pathname = alertsTabDetailsFullyQualified;
      setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, created);
    });
    if (!created) {
      triggerReload(Math.random());
    }
  }

  const isInDetailsView = location.pathname === globalAlertDetails;

  return (
    <>
      <Title title={t('in-applications:titleAlertDetails')} dynamic={alertConfig.name} />
      <div>
        <AlertHeader
          alertConfig={alertConfig}
          alertConfigVersions={alertConfigVersions}
          setRevision={setRevision}
          openDialog={() => {
            addActiveDialog(
              <SmartAlertConfigDialogWrapper
                applicationLabel={applicationName}
                formData={alertConfig}
                onClose={() => {
                  close();
                  setRevision(null);
                }}
                editMode
              />
            );

            applicationsAlertingAlertEdit({ alertConfigId: alertConfig.id });
          }}
          fullyQualifiedAlertsList={isInDetailsView && isGlobalAlertConfig ? alertsList : alertsTabListFullyQualified}
          doEnableConfig$={enableAlertConfig}
          doDisableConfig$={disableAlertConfig}
          doDeleteConfig$={deleteAlertConfig}
          doRestoreConfig$={updateAlertConfig}
          onConfigStateChanged={(alertConfigId, enabled) => {
            if (enabled) {
              applicationsAlertingAlertPaused({ alertConfigId });
            } else {
              applicationsAlertingAlertResumed({ alertConfigId });
            }
          }}
          onConfigDeleted={applicationsAlertingAlertDeleted}
          onConfigRevisionChanged={applicationsAlertingAlertRevisionChanged}
        />

        <Row>
          <Col xs={6}>
            <AlertConfiguration alertConfig={alertConfig} applicationName={applicationName} />
          </Col>
          <Col xs={6}>
            <AlertHistoryList alertConfigId={alertConfig.id} timeConfig={timeConfig} />
          </Col>
        </Row>
      </div>
      <SetBodyColor color="#fff" />
      <Footer />
    </>
  );
}
