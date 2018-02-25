import React from 'react';

import ApplicationSwitcher from 'in-applications/breadcrumbs/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';

import locals from './ApplicationViewBreadcrumbWithSwitcher.mless';

export default connect(props => ({
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
}))(ApplicationListViewBreadcrumb);

function ApplicationListViewBreadcrumb(props) {
  const { application, applications, applicationId } = props;

  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    (applications.progress.loading || applications.errors.length > 0)
  ) {
    return <Breadcrumb href$={getApplicationDashboard(applicationId)} label="Application" />;
  } else {
    return (
      <Overlay content={ApplicationSwitcher} props={props} withoutWrapper>
        {OverlayActivator}
      </Overlay>
    );
  }
}

function OverlayActivator({ application, applications, applicationId, toggle, refSetter }) {
  return (
    <Breadcrumb
      href$={getApplicationDashboard(applicationId)}
      label={`Application (${applications.data.items.length})`}
      refSetter={refSetter}
    >
      {application.data.label}
      <span
        href="#"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          toggle();
        }}
        className={locals.subMenuToggle}
      >
        <SvgIcon type="triangle_down" width={10} height={10} className={locals.subMenuToggleIcon} />
      </span>
    </Breadcrumb>
  );
}
