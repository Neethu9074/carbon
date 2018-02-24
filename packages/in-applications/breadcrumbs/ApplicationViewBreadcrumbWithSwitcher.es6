import { compose, withState, withHandlers } from 'recompose';
import React, { Fragment } from 'react';

import ApplicationSwitcher from 'in-applications/breadcrumbs/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';

import locals from './ApplicationViewBreadcrumbWithSwitcher.mless';

export default compose(
  connect(props => ({
    application: getApplication({
      id: props.applicationId,
      filter: {
        application: props.applicationId,
        timeframe: props.timeframe
      }
    }),
    applications: getApplications({
      pagination: {
        page: 1,
        pageSize: 5
      },
      order: {
        by: 'label',
        direction: 'ASC'
      },
      metrics: {},
      filter: {
        timeframe: props.timeframe
      }
    })
  })),
  withState('subMenuCoordinates', 'setSubMenuCoordinates', null),
  withHandlers({
    toggleSubMenu: ({ subMenuCoordinates, setSubMenuCoordinates }) => event => {
      setSubMenuCoordinates(subMenuCoordinates == null ? { x: event.clientX, y: event.clientY } : null);
    },
    closeSubMenu: ({ setSubMenuCoordinates }) => () => setSubMenuCoordinates(null)
  })
)(ApplicationListViewBreadcrumb);

function ApplicationListViewBreadcrumb({
  application,
  applications,
  applicationId,
  serviceId,
  endpointId,
  viewPath,
  subMenuCoordinates,
  toggleSubMenu,
  closeSubMenu
}) {
  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    (applications.progress.loading || applications.errors.length > 0)
  ) {
    return <Breadcrumb href$={getApplicationDashboard(applicationId)} label="Application" />;
  } else {
    return (
      <Fragment>
        {subMenuCoordinates != null && (
          <ApplicationSwitcher
            applications={applications}
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            viewPath={viewPath}
            coords={subMenuCoordinates}
            onClose={closeSubMenu}
          />
        )}

        <Breadcrumb
          href$={getApplicationDashboard(applicationId)}
          label={`Application (${applications.data.items.length})`}
        >
          {application.data.label}
          <span
            href="#"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              toggleSubMenu(e);
            }}
            className={locals.subMenuToggle}
          >
            <SvgIcon type="triangle_down" width={10} height={10} className={locals.subMenuToggleIcon} />
          </span>
        </Breadcrumb>
      </Fragment>
    );
  }
}
