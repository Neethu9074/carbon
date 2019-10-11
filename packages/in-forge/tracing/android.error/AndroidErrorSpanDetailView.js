import React from 'react';
import Code from 'in-components/Code';
import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function AndroidErrorSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="App Version Name">{span.getIn(['data', 'android_error', 'report', 'app_version_name'])}</Di>

        <Di title="Android Version">{span.getIn(['data', 'android_error', 'report', 'android_version'])}</Di>

        <Di title="Phone Model">{span.getIn(['data', 'android_error', 'phone_model'])}</Di>

        <Di title="Carrier">{span.getIn(['data', 'android_error', 'report', 'provider'])}</Di>

        <Di title="Network Type">{span.getIn(['data', 'android_error', 'report', 'networkType'])}</Di>

        <Di title="Crash Date">{formatDateTime(span.getIn(['data', 'android_error', 'crashTimestamp']))}</Di>

        <Di title="IP">{span.getIn(['data', 'android_error', 'ip'])}</Di>

        <Di title="Location">
          <GeoLocation geo={span.getIn(['data', 'android_error', 'geo'])} />
        </Di>

        <Di title="Stacktrace" verticalDisplay>
          <Code lang="json" code={span.getIn(['data', 'android_error', 'report', 'stack_trace'])} />
        </Di>
      </Dl>
    </div>
  );
}
