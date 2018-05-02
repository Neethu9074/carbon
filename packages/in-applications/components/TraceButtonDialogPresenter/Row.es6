import { get } from 'lodash';
import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import { getTracesCount } from 'in-applications/components/TracesButton';
import { number, percentage } from 'in-services/formatters/number';
import backButtonStore from 'in-analyze/stores/backButtonStore';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { identity } from 'in-services/util/function';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Row.mless';

export default connectTo(
  ({ label, value, getEntity, timeframe, applicationId, serviceId, endpointId }) => {
    const observables = {};
    if (!value) {
      observables.value = getTracesCount({ timeframe, applicationId, serviceId, endpointId });
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
    return (
      <div className={locals.row}>
        <div className={locals.heading}>
          <EntityWithTypeAndIcon label={label} type={type} iconType={iconType} />
          <ValueAndPercentage href$={linkToAnalyze} value={value} total={total} backButtonLabels={backButtonLabels} />
        </div>
        <Bar percentage={value / total} />
      </div>
    );
  }
);

function storeBackButtonParameters(backButtonLabels) {
  // In the analyze traces views, we need to render a breadcrumb item that takes the user back to the last
  // explore dashboard (from which they went to analyze traces). We simply store the current route and the labels
  // of the currently right-most breadcrumb item. We fetch the current route from the URL stream (without modifications,
  // so we pass in identity for the modification function).
  getModifiedUrlStream(identity).once(backButtonRoute => {
    backButtonStore.setRoute(backButtonRoute);
    backButtonStore.setLabel1('< ' + backButtonLabels.label1);
    backButtonStore.setLabel2(backButtonLabels.label2);
  });
}

function ValueAndPercentage({ value, total, href$, backButtonLabels }) {
  const renderedValue = value == null ? '––' : number.compact(value);
  const LinkOrSpan = href$ ? Link : 'span';
  const prepareBackButton = storeBackButtonParameters.bind(null, backButtonLabels);
  return (
    <div className={locals.valueAndPercentageWrapper}>
      <LinkOrSpan href$={href$} onClick={prepareBackButton}>
        {renderedValue}
      </LinkOrSpan>
      <LinkOrSpan href$={href$} onClick={prepareBackButton} className={locals.percentage}>
        {value != null && total != null && `(${percentage.detailed(value / total)})`}
      </LinkOrSpan>
    </div>
  );
}

function Bar({ percentage }) {
  return (
    <div className={locals.outerBar}>
      <div style={{ width: `${percentage * 100}%` }} className={locals.innerBar} />
    </div>
  );
}
