import { compose, withState } from 'recompose';
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
  deleteAlertConfig
} from 'in-applications/api/applicationAlertConfig';
import {
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-applications/navigation/matrix';
import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import AlertConfiguration from 'in-applications/Dashboards/application/tabs/Alerts/AlertConfiguration';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import AlertHeader from 'in-new-components/Alerting/components/AlertHeader';
import getApplication from 'in-subscription/application/getApplication';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { alertsTab } from 'in-applications/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import Footer from 'in-new-components/Footer/Footer';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withState('revision', 'setRevision', undefined),
  withState('reload', 'triggerReload', undefined),
  connectTo(({ revision, location }) => {
    const alertConfigId = getMatrixParameter(location, alertsTab, alertIdMatrixParam);
    const alertConfigCreated = getMatrixParameter(location, alertsTab, alertCreatedMatrixParam);
    const alertConfig$ = revision
      ? getAlertConfig(revision.id, revision.created)
      : getAlertConfig(alertConfigId, alertConfigCreated);
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
  setRevision,
  triggerReload,
  applicationName
}) {
  if (alertConfigError || alertConfigVersionsError) {
    return <ErroneousResultPresenter errors={[alertConfigError, alertConfigVersionsError].filter(Boolean)} />;
  } else if (!alertConfig || !alertConfigVersions) {
    return <DefaultLoadingDashboard />;
  }

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      {dialogOpen && (
        <SmartAlertConfigDialogWrapper
          formData={alertConfig}
          onClose={() => {
            setDialogOpen(false);
            triggerReload(Math.random());
          }}
          editMode
        />
      )}
      <div>
        <AlertHeader
          alertConfig={alertConfig}
          alertConfigVersions={alertConfigVersions}
          setRevision={setRevision}
          openDialog={() => {
            setDialogOpen(true);
            applicationsAlertingAlertEdit(alertConfig.id);
          }}
          fullyQualifiedAlertsList={alertsTabListFullyQualified}
          doEnableConfig$={enableAlertConfig}
          doDisableConfig$={disableAlertConfig}
          doDeleteConfig$={deleteAlertConfig}
          onConfigStateChanged={(configId, enabled) => {
            if (enabled) {
              applicationsAlertingAlertPaused(configId);
            } else {
              applicationsAlertingAlertResumed(configId);
            }
          }}
          onConfigDeleted={applicationsAlertingAlertDeleted}
          onConfigRevisionChanged={applicationsAlertingAlertRevisionChanged}
        />

        <Row>
          <Col xs={6}>
            <AlertConfiguration alertConfig={alertConfig} applicationName={applicationName} />
          </Col>
          <Col xs={6}>{/* TODO: implement a list of created events */}</Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
