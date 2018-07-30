import { interval, just } from 'reactive-observables';
import { Redirect } from 'react-router-dom';
import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
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
        })
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
            <FullscreenViewHeading iconClassName={locals.headingIcon} iconType="lib_application">
              Application perspective is being created…
            </FullscreenViewHeading>

            <div className={locals.loading}>
              <div>
                We are preparing everything to monitor your application perspective <strong>{label}</strong>.
              </div>
              <div>Please wait.</div>
              <div>
                <SvgIcon spinning type="spinner" width={20} className={locals.spinner} />
              </div>
            </div>
          </div>
        )}
      />
    );
  }
);
