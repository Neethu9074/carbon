/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import ApplicationSwitcher from 'in-applications/components/ApplicationSwitcherContext/ApplicationSwitcher';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import getApplications from 'in-subscription/application/getApplications';
import getApplication from 'in-subscription/application/getApplication';
import { pendingResult } from 'in-services/fixedObjects';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './ApplicationSwitcherContext.mless';

export default function ApplicationSwitcherContext(props) {
  const { applicationId, serviceId, endpointId, timeConfig, boundaryScope, syntheticCalls } = props;
  const application = useObservable(getApplicationObservable, [applicationId]) ?? pendingResult;
  const applications = useObservable(getApplicationsObservable, [serviceId, endpointId, timeConfig]) ?? pendingResult;

  if (
    application.progress.loading ||
    application.errors.length > 0 ||
    applications.progress.loading ||
    applications.errors.length > 0
  ) {
    return (
      <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope, syntheticCalls })}>
        {t('in-applications:labelApplication')}
      </Link>
    );
  }

  const numApplications = applications.data.items.length;
  const hasOnlyOneApplication = numApplications === 1;

  return (
    <>
      {hasOnlyOneApplication ? (
        <Link className={locals.link} href$={getApplicationDashboard(applicationId, { boundaryScope, syntheticCalls })}>
          <Context context={t('in-applications:labelApplication')} label={application.data.label} />
        </Link>
      ) : (
        <Overlay content={ApplicationSwitcher} props={{ ...props, application, applications }} autoOpen>
          {() => (
            <div className={locals.flexWrapper}>
              <Link
                className={locals.link}
                href$={getApplicationDashboard(applicationId, { boundaryScope, syntheticCalls })}
              >
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
