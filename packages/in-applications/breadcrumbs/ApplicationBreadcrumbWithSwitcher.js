import { compose } from 'recompose';
import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import ApplicationSwitcher from 'in-applications/breadcrumbs/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';

import locals from './ApplicationBreadcrumbWithSwitcher.mless';

export default compose(
  connect(props => ({
    application: getApplication({
      id: props.applicationId
    }),
    applications: getApplications({
      pagination: {
        page: 1,
        pageSize: 20
      },
      order: {
        by: 'applicationLabel',
        direction: 'ASC'
      },
      metrics: {},
      filter: {
        service: props.serviceId,
        endpoint: props.endpointId,
        timeConfig: props.timeConfig,
        includeSyntheticCalls: true
      }
    })
  }))
)(ApplicationBreadcrumbWithSwitcher);

function ApplicationBreadcrumbWithSwitcher(props) {
  const { application, applications, applicationId, boundaryScope } = props;

  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    (applications.progress.loading || applications.errors.length > 0)
  ) {
    return (
      <WithApplicationHealthIndicationBehaviour
        applicationId={applicationId}
        render={healthInfo => (
          <Breadcrumb
            href$={getApplicationDashboard(applicationId, { boundaryScope })}
            label="Application"
            icon="lib_application"
            healthInfo={healthInfo}
          />
        )}
      />
    );
  }

  const hasOnlyOneApplication = applications.data.items.length == 1;

  return (
    <WithApplicationHealthIndicationBehaviour
      applicationId={applicationId}
      render={healthInfo => (
        <Breadcrumb
          className={locals.wrapper}
          href$={getApplicationDashboard(applicationId, { boundaryScope })}
          icon="lib_application"
          healthInfo={healthInfo}
        >
          {hasOnlyOneApplication && <span className={locals.appName}>{application.data.label}</span>}
          {!hasOnlyOneApplication && (
            <Overlay content={ApplicationSwitcher} props={props} autoOpen>
              {() => (
                <div className={locals.flexWrapper}>
                  <span className={locals.appName}>{application.data.label}</span>
                  <SvgIcon type="lib_arrow_expand_down" size="s" className={locals.toggleIcon} />
                </div>
              )}
            </Overlay>
          )}
        </Breadcrumb>
      )}
    />
  );
}
