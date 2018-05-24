import { compose } from 'recompose';
import React from 'react';

import ApplicationSwitcher from 'in-applications/breadcrumbs/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
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
        timeConfig: props.timeConfig
      }
    })
  }))
)(ApplicationBreadcrumbWithSwitcher);

function ApplicationBreadcrumbWithSwitcher(props) {
  const { application, applications, applicationId } = props;

  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    (applications.progress.loading || applications.errors.length > 0)
  ) {
    return <Breadcrumb href$={getApplicationDashboard(applicationId)} label="Application" />;
  }

  return (
    <Overlay content={ApplicationSwitcher} props={props} position="fixed">
      {({ open }) => (
        <div onMouseEnter={open}>
          <Breadcrumb
            className={locals.wrapper}
            href$={getApplicationDashboard(applicationId)}
            label={`Application (${applications.data.items.length})`}
          >
            <span className={locals.appName}>{application.data.label}</span>
            <SvgIcon type="triangle_down" width={8} height={8} className={locals.toggleIcon} />
          </Breadcrumb>
        </div>
      )}
    </Overlay>
  );
}
