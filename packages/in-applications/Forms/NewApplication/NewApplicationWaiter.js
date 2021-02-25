/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { interval, just } from '@instana/observables';
import { Redirect } from 'react-router-dom';
import { Trans, t } from 'in-i18n';
import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import { getWaitForEntityCreationTimeConfig } from 'in-stores/time/config';
import getApplication from 'in-subscription/application/getApplication';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './NewApplicationWaiter.mless';

export default connectTo(
  props => {
    const appId = props.match.params.appId;
    return {
      result: interval(3000)
        .flatMap(() =>
          getApplication({
            id: appId,
            requestTime: Date.now() // subscription cache busting
          })
        )
        .flatMap(result => {
          if (result.progress.loading || result.errors.length > 0) {
            return just(result);
          } else {
            return getApplicationDashboard(result.data.id, {
              timeConfig: getWaitForEntityCreationTimeConfig()
            });
          }
        }),
      label: just(props.match.params.appName)
    };
  },
  function NewApplicationWaiter({ result, label }) {
    if (typeof result === 'string') {
      return <Redirect to={result.substring(2)} />;
    }

    return (
      <FullHeightWrapper
        render={() => (
          <div className={locals.wrapper}>
            <SvgIcon className={locals.icon} type="lib_application" size="xxl" />
            <h1 className={locals.title}>{t('in-applications:forms.newApplication.titleApplicationCreating')}</h1>
            <p className={locals.text}>
              <Trans
                i18nKey="in-applications:forms.newApplication.descriptionPrepareToMonitor"
                values={{ decodedLabel: decodeURIComponent(label) }}
                components={{ bold: <strong /> }}
              />
            </p>
            <SvgIcon spinning type="lib_actions_loading" size="l" className={locals.loadingIcon} />
          </div>
        )}
      />
    );
  }
);
