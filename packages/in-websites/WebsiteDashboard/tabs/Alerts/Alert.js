import { compose, withState } from 'recompose';
import React, { useState } from 'react';

import {
  websitesAlertingAlertRevisionChanged,
  websitesAlertingAlertDeleted,
  websitesAlertingAlertResumed,
  websitesAlertingAlertPaused,
  websitesAlertingAlertEdit
} from 'in-websites/alerting/tracker';
import {
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-websites/api/websiteAlertConfig';
import { alertsTab, alertsTabListFullyQualified, alertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import AlertConfiguration from 'in-websites/WebsiteDashboard/tabs/Alerts/AlertConfiguration';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { alertCreated as alertCreatedMatrixParam } from 'in-websites/navigation/matrix';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import AlertHistoryList from 'in-new-components/Alerting/components/AlertHistoryList';
import { alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import AlertHeader from 'in-new-components/Alerting/components/AlertHeader';
import AlertConfigDialog from 'in-websites/alerting/AlertConfigDialog';
import getWebsite from 'in-subscription/website/getWebsite';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withState('reload', 'triggerReload', undefined),
  connectTo(({ location }) => {
    const alertConfigId = getMatrixParameter(location, alertsTab, alertIdMatrixParam);
    const alertConfigCreated = getMatrixParameter(location, alertsTab, alertCreatedMatrixParam);
    const alertConfig$ = getAlertConfig(alertConfigId, alertConfigCreated);
    const alertConfigVersions$ = getAllVersionsOfAlertConfig(alertConfigId).startWith(null);
    const websiteLabel$ = alertConfig$.flatMap(({ websiteId }) =>
      getWebsite({ id: websiteId }).map(({ data }) => data && data.label)
    );

    return {
      alertConfig: alertConfig$.startWith(null),
      alertConfigVersions: alertConfigVersions$,
      alertConfigError: alertConfig$.errors(),
      alertConfigVersionsError: alertConfigVersions$.errors(),
      websiteLabel: websiteLabel$
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
  websiteLabel
}) {
  if (alertConfigError || alertConfigVersionsError) {
    return <ErroneousResultPresenter errors={[alertConfigError, alertConfigVersionsError].filter(Boolean)} />;
  } else if (!alertConfig || !alertConfigVersions) {
    return <DefaultLoadingDashboard />;
  }

  const [dialogOpen, setDialogOpen] = useState(false);

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
      {dialogOpen && (
        <AlertConfigDialog
          onClose={() => {
            setDialogOpen(false);
            setRevision(null);
          }}
          formData={alertConfig}
          websiteLabel={websiteLabel}
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
            websitesAlertingAlertEdit(alertConfig.id);
          }}
          fullyQualifiedAlertsList={alertsTabListFullyQualified}
          doEnableConfig$={enableAlertConfig}
          doDisableConfig$={disableAlertConfig}
          doDeleteConfig$={deleteAlertConfig}
          onConfigStateChanged={(configId, enabled) => {
            if (enabled) {
              websitesAlertingAlertPaused(configId);
            } else {
              websitesAlertingAlertResumed(configId);
            }
          }}
          onConfigDeleted={websitesAlertingAlertDeleted}
          onConfigRevisionChanged={websitesAlertingAlertRevisionChanged}
        />

        <Row>
          <Col xs={6}>
            <AlertConfiguration alertConfig={alertConfig} websiteLabel={websiteLabel} />
          </Col>
          <Col xs={6}>
            <AlertHistoryList alertConfigId={alertConfig.id} timeConfig={timeConfig} />
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
