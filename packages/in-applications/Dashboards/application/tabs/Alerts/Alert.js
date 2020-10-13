import { compose, withState } from 'recompose';
import React from 'react';

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
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default compose(
  withState('reload', 'triggerReload', undefined),
  connectTo(({ location }) => {
    const alertConfigId = getMatrixParameter(location, alertsTab, alertIdMatrixParam);
    const alertConfigCreated = getMatrixParameter(location, alertsTab, alertCreatedMatrixParam);
    const alertConfig$ = getAlertConfig(alertConfigId, alertConfigCreated);
    const alertConfigVersions$ = getAllVersionsOfAlertConfig(alertConfigId).startWith(null);
    const applicationName$ = alertConfig$.flatMap(({ applicationId }) =>
      getApplication({ id: applicationId }).map(({ data }) => data && data.label)
    );

    return {
      alertConfig: alertConfig$.startWith(null),
      alertConfigVersions: alertConfigVersions$,
      alertConfigError: alertConfig$.errors(),
      alertConfigVersionsError: alertConfigVersions$.errors(),
      applicationName: applicationName$
    };
  })
)(Alert);

function getAlertConfig(id, created) {
  return created ? getAlertConfigByIdAndTimestamp(id, created) : getLatestAlertConfig(id);
}

function Alert({
  alertConfig,
  alertConfigError,
  alertConfigVersions,
  alertConfigVersionsError,
  triggerReload,
  timeConfig,
  applicationName
}) {
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
