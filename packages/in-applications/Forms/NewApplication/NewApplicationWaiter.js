/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Redirect } from 'react-router-dom';
import React, { useState } from 'react';

import { interval } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import getApplication from 'in-applications/subscriptions/getApplication';
import { Trans, t } from 'in-i18n';

import locals from './NewApplicationWaiter.mless';

export default function NewApplicationWaiter({ match }) {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const appId = match.params.appId;

  const result = useObservable(
    interval(3000)
      .flatMap(() =>
        getApplication({
          id: appId,
          requestTime: Date.now() // subscription cache busting
        })
      )
      .map(result => {
        if (result.progress.loading || result.errors.length > 0) {
          return result;
        } else {
          return getLinkToApplicationDashboard({
            applicationId: result.data.id,
            timeConfig: getWaitForEntityCreationTimeConfig()
          });
        }
      }),
    [appId]
  );

  const label = match.params.appName;
  const [hasRbacErrors, setHasRbacErrors] = useState(false);

  if (typeof result === 'string') {
    return <Redirect to={result.substring(2)} />;
  } else {
    if (!hasRbacErrors && result?.errors?.map(e => e.code).includes('AUTH')) {
      setHasRbacErrors(true);
    }
  }

  const title = hasRbacErrors
    ? t('in-applications:forms.newApplication.titleApplicationCreatingUnauthorized')
    : t('in-applications:forms.newApplication.titleApplicationCreating');

  return (
    <FullHeightWrapper
      render={() => (
        <div className={locals.wrapper}>
          <SvgIcon className={locals.icon} type="lib_application" size="xxl" />
          <h1 className={locals.title}>{title}</h1>
          <p className={locals.text}>
            {hasRbacErrors ? (
              <Trans
                i18nKey={'in-applications:forms.newApplication.prepareToMonitorUnauthorized'}
                values={{ decodedLabel: decodeURIComponent(label) }}
                components={{ bold: <strong /> }}
              />
            ) : (
              <Trans
                i18nKey={'in-applications:forms.newApplication.descriptionPrepareToMonitor'}
                values={{ decodedLabel: decodeURIComponent(label) }}
                components={{ bold: <strong /> }}
              />
            )}
          </p>
          {!hasRbacErrors && <SvgIcon spinning type="lib_actions_loading" size="l" className={locals.loadingIcon} />}
        </div>
      )}
    />
  );
}
