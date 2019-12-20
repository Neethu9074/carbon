import { compose } from 'recompose';
import React from 'react';

import ApplicationSwitcher from 'in-applications/components/ApplicationSwitcherContext/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ApplicationSwitcherContext.mless';

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
)(ApplicationSwitcherContext);

function ApplicationSwitcherContext(props) {
  const { application, applications, applicationId, boundaryScope } = props;

  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    (applications.progress.loading || applications.errors.length > 0)
  ) {
    return (
      <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope })}>
        Applcation
      </Link>
    );
  }

  const numApplications = applications.data.items.length;
  const hasOnlyOneApplication = numApplications === 1;

  return (
    <>
      {hasOnlyOneApplication ? (
        <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope })}>
          <Context context="Application" label={application.data.label} />
        </Link>
      ) : (
        <Overlay content={ApplicationSwitcher} props={props} autoOpen>
          {() => (
            <div className={locals.flexWrapper}>
              <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope })}>
                <Context
                  context={`Application (${numApplications})`}
                  label={
                    <>
                      {application.data.label}
                      <SvgIcon className={locals.toggleIcon} type="lib_arrow_drop_down" size="s" />
                    </>
                  }
                />
              </Link>
            </div>
          )}
        </Overlay>
      )}
    </>
  );
}

function Context({ label, context }) {
  return (
    <div className={locals.labelWrapper}>
      {context && <span className={locals.context}>{context}</span>}
      <span className={locals.label}>{label}</span>
    </div>
  );
}
