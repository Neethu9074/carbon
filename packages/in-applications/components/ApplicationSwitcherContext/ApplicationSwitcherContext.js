/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ApplicationSwitcher from 'in-applications/components/ApplicationSwitcherContext/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import { pendingResult } from 'in-services/fixedObjects';
import Overlay from 'in-new-components/overlays/Overlay';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './ApplicationSwitcherContext.mless';

export default function ApplicationSwitcherContext(props) {
  const { applicationId, serviceId, endpointId, timeConfig, boundaryScope } = props;
  const application = useObservable(getApplicationObservable, [applicationId]) ?? pendingResult;
  const applications = useObservable(getApplicationsObservable, [serviceId, endpointId, timeConfig]) ?? pendingResult;

  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    applications.progress.loading ||
    applications.errors.length > 0
  ) {
    return (
      <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope })}>
        {t('in-applications:labelApplication')}
      </Link>
    );
  }

  const numApplications = applications.data.items.length;
  const hasOnlyOneApplication = numApplications === 1;

  return (
    <>
      {hasOnlyOneApplication ? (
        <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope })}>
          <Context context={t('in-applications:labelApplication')} label={application.data.label} />
        </Link>
      ) : (
        <Overlay content={ApplicationSwitcher} props={{ ...props, application, applications }} autoOpen>
          {() => (
            <div className={locals.flexWrapper}>
              <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope })}>
                <Context
                  context={t('in-applications:labelApplicationWithNum', {
                    numApplications: numApplications
                  })}
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

function getApplicationsObservable([serviceId, endpointId, timeConfig]) {
  return getApplications({
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
      service: serviceId,
      endpoint: endpointId,
      timeConfig: timeConfig,
      includeSyntheticCalls: true
    }
  });
}

function getApplicationObservable([id]) {
  return getApplication({
    id
  });
}
