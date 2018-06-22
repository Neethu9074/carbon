import { get } from 'lodash';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getTracesCount } from 'in-applications/components/TracesButton';
import { number, percentage } from 'in-services/formatters/number';
import { evaluateClassNames } from 'in-services/util/classnames';
import backButtonStore from 'in-analyze/stores/backButtonStore';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { createTracker } from 'in-services/tracking/mixpanel';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { identity } from 'in-services/util/function';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Row.mless';

const trackTracesButton = createTracker('application.tracesButton');

export default connectTo(
  ({ label, value, getEntity, timeConfig, applicationId, serviceId, endpointId }) => {
    const observables = {};
    if (!value) {
      observables.value = getTracesCount({ timeConfig, applicationId, serviceId, endpointId });
    }
    if (!label) {
      observables.label = getEntity().map(result => get(result, ['data', 'label'], null));
    }
    return observables;
  },
  function Row({ label, value, total, iconType, type, applicationId, serviceId, endpointId, backButtonLabels }) {
    if (!label || value == null) {
      return null;
    }

    const linkToAnalyze =
      applicationId || serviceId || endpointId ? getLinkToAnalyze({ applicationId, serviceId, endpointId }) : null;
    const trackAndPrepareBackButton = trackAndStoreBackButtonParameters.bind(null, backButtonLabels);
    return (
      <Link className={locals.link} href$={linkToAnalyze} onClick={trackAndPrepareBackButton}>
        <div
          className={evaluateClassNames({
            [locals.row]: true,
            [locals.selectableRow]: linkToAnalyze
          })}
        >
          <div className={locals.heading}>
            <EntityWithTypeAndIcon label={label} type={type} iconType={iconType} />
            <ValueAndPercentage value={value} total={total} />
          </div>
          <Bar percentage={value / total} />
        </div>
      </Link>
    );
  }
);

function trackAndStoreBackButtonParameters(backButtonLabels) {
  trackTracesButton();

  // In the analyze traces views, we need to render a breadcrumb item that takes the user back to the last
  // explore dashboard (from which they went to analyze traces). We simply store the current route and the labels
  // of the currently right-most breadcrumb item. We fetch the current route from the URL stream (without modifications,
  // so we pass in identity for the modification function).
  getModifiedUrlStream(identity).once(backButtonRoute => {
    backButtonStore.setRoute(backButtonRoute);
    backButtonStore.setLabel1(backButtonLabels ? '< ' + backButtonLabels.label1 : '< Explore');
    backButtonStore.setLabel2(backButtonLabels ? backButtonLabels.label2 : 'Applications');
  });
}

function ValueAndPercentage({ value, total }) {
  const renderedValue = value == null ? '––' : number.compact(value);
  return (
    <div className={locals.valueAndPercentageWrapper}>
      {renderedValue}
      <span className={locals.percentage}>
        {value != null && total != null && `(${percentage.detailed(value / total)})`}
      </span>
    </div>
  );
}

function Bar({ percentage }) {
  percentage = Math.min(1, Math.max(percentage, 0));
  return (
    <div className={locals.outerBar}>
      <div style={{ width: `${percentage * 100}%` }} className={locals.innerBar} />
    </div>
  );
}
