import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import getApplication from 'in-subscription/application/getApplication';
import { interval, just } from 'reactive-observables';
import SvgIcon from 'in-components/SvgIcon';
import { Redirect } from 'react-router-dom';
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
  function NewApplicationWaiter({ result, label, applicationToEdit }) {
    if (typeof result === 'string') {
      return <Redirect to={result.substring(2)} />;
    }

    return (
      <FullHeightWrapper
        render={() => (
          <div className={locals.wrapper}>
            <FullscreenViewHeading iconClassName={locals.headingIcon} iconType={'app_application'}>
              {applicationToEdit == null ? 'Application is being created…' : 'Application is being adjusted…'}
            </FullscreenViewHeading>

            {(result == null || result.progress.loading) &&
              (applicationToEdit == null ? waitForNewApp(label) : waitForEditedApp(label))}
          </div>
        )}
      />
    );
  }
);

function waitForNewApp(label) {
  return (
    <div className={locals.loading}>
      <div>
        We are preparing everything to monitor your application <strong>{label}</strong>.
      </div>
      <div>Please wait.</div>
      <div>
        <SvgIcon spinning type="spinner" width={20} className={locals.spinner} />
      </div>
    </div>
  );
}

function waitForEditedApp(label) {
  return (
    <div className={locals.loading}>
      <div>
        We are adjusting your application <strong>{label}</strong>.
      </div>
      <div>Please wait.</div>
      <div>
        <SvgIcon spinning type="spinner" width={20} className={locals.spinner} />
      </div>
    </div>
  );
}

function getApp(props) {
  return getApplication({
    id: props.applicationId,
    filter: {
      application: props.applicationId,
      timeframe: props.timeframe
    }
  });
}
