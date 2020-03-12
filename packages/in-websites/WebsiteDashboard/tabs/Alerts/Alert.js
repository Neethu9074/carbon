import { compose, withState } from 'recompose';
import React, { useState } from 'react';

import {
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig
} from 'in-websites/api/websiteAlertConfig';
import AlertConfiguration from 'in-websites/WebsiteDashboard/tabs/Alerts/AlertConfiguration';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { alertCreated as alertCreatedMatrixParam } from 'in-websites/navigation/matrix';
import AlertHeader from 'in-websites/WebsiteDashboard/tabs/Alerts/AlertHeader';
import { alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { websitesAlertingAlertEdit } from 'in-websites/eum-alerting/tracker';
import AlertConfigDialog from 'in-websites/eum-alerting/AlertConfigDialog';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import getWebsite from 'in-subscription/website/getWebsite';
import { Row, Col } from 'in-new-components/layout/Grid';
import { alertTab } from 'in-websites/navigation/paths';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withState('revision', 'setRevision', undefined),
  withState('reload', 'triggerReload', undefined),
  connectTo(({ revision, location }) => {
    const alertConfigId = getMatrixParameter(location, alertTab, alertIdMatrixParam);
    const alertConfigCreated = getMatrixParameter(location, alertTab, alertCreatedMatrixParam);
    const alertConfig$ = revision
      ? getAlertConfig(revision.id, revision.created)
      : getAlertConfig(alertConfigId, alertConfigCreated);
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
  setRevision,
  triggerReload,
  websiteLabel
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
        <AlertConfigDialog
          onClose={() => {
            setDialogOpen(false);
            triggerReload(Math.random());
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
        />

        <Row>
          <Col xs={6}>
            <AlertConfiguration alertConfig={alertConfig} websiteLabel={websiteLabel} />
          </Col>
          <Col xs={6}>{/* TODO: implement a list of created events */}</Col>
        </Row>
      </div>
    </>
  );
}
