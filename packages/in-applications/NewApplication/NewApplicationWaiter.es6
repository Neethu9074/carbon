import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { getApplicationDashboard, newApplicationView } from 'in-applications/navigation/paths';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import getApplication from 'in-subscription/application/getApplication';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { interval, just } from 'reactive-observables';
import SvgIcon from 'in-components/SvgIcon';
import { Redirect } from 'react-router-dom';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import locals from './NewApplicationWaiter.mless';

export default connectTo(
  props => ({
    result: interval(3000)
      .flatMap(() => getApp(props))
      .flatMap(result => {
        if (result.progress.loading || result.errors.length > 0) {
          return just(result);
        } else {
          return getApplicationDashboard(props.applicationId);
        }
      })
  }),
  function NewApplicationWaiter({ result, label }) {
    if (typeof result === 'string') {
      return <Redirect to={result.substring(2)} />;
    }

    return (
      <FullHeightWrapper
        render={() => (
          <div className={locals.wrapper}>
            <FullscreenViewHeading iconClassName={locals.headingIcon} iconType={'app_application'}>
              Working…
            </FullscreenViewHeading>

            {(result == null || result.progress.loading) && (
              <p>
                <span>
                  <SvgIcon spinning type="spinner" width={20} className={locals.spinner} /> <br />
                  We are preparing everything to monitor your application <strong>{label}</strong>. Please wait.
                </span>
              </p>
            )}

            {result != null &&
              result.errors.length > 0 && (
                <p>
                  <span>
                    <SvgIcon spinning type="spinner" width={20} className={locals.spinner} /> <br />
                    An error occurred while creating your application <strong>{label}</strong>. <br />
                    <Button
                      kind="default"
                      key="createApplication"
                      href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
                      size="sm"
                      outlineOnly
                    >
                      Try again
                    </Button>
                  </span>
                </p>
              )}
          </div>
        )}
      />
    );
  }
);

function getApp(props) {
  return getApplication({
    id: props.applicationId,
    filter: {
      application: props.applicationId,
      timeframe: props.timeframe
    }
  });
}
