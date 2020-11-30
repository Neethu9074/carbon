import React, { useState } from 'react';

import {
  applicationsAlertingAlertRevisionChanged,
  applicationsAlertingAlertEdit,
  applicationsAlertingAlertPaused,
  applicationsAlertingAlertResumed,
  applicationsAlertingAlertDeleted
} from 'in-applications/alerting/tracker';
import {
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig,
  updateAlertConfig
} from 'in-applications/api/applicationAlertConfig';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
import { alertsTabDetailsFullyQualified, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import AlertConfiguration from 'in-applications/Dashboards/application/tabs/Alerts/AlertConfiguration';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import AlertHistoryList from 'in-new-components/Alerting/components/AlertHistoryList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import AlertHeader from 'in-new-components/Alerting/components/AlertHeader';
import getApplication from 'in-subscription/application/getApplication';
import { alertsTab } from 'in-applications/navigation/paths';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import SetBodyColor from 'in-components/SetBodyColor';
import Footer from 'in-new-components/Footer/Footer';
import useObservable from 'in-hooks/useObservable';
import Title from 'in-components/Title';

function getAlertConfig(id, created) {
  return created ? getAlertConfigByIdAndTimestamp(id, created) : getLatestAlertConfig(id);
}

export default function Alert({ location, timeConfig }) {
  const alertConfigId = getMatrixParameter(location, alertsTab, alertIdMatrixParam);
  const alertConfigCreated = getMatrixParameter(location, alertsTab, alertCreatedMatrixParam);

  const alertConfig$ = getAlertConfig(alertConfigId, alertConfigCreated);
  const alertConfigVersions$ = getAllVersionsOfAlertConfig(alertConfigId).startWith(null);
  const applicationName$ = alertConfig$.flatMap(({ applicationId }) =>
    getApplication({ id: applicationId }).map(({ data }) => data && data.label)
  );

  const alertConfig = useObservable(alertConfig$.startWith(null), [alertConfigId, alertConfigCreated]);
  const alertConfigError = useObservable(alertConfig$.errors(), [alertConfigId, alertConfigCreated]);
  const alertConfigVersions = useObservable(alertConfigVersions$, [alertConfigId]);
  const alertConfigVersionsError = useObservable(alertConfigVersions$.errors(), [alertConfigId]);
  const applicationName = useObservable(applicationName$, [alertConfigId, alertConfigCreated]);
  const [, triggerReRender] = useState(undefined);

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
      triggerReRender(Math.random());
    }
  }

  return (
    <>
      <Title title="Alert Details" dynamic={alertConfig.name} />
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
          fullyQualifiedAlertsList={alertsTabListFullyQualified}
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
