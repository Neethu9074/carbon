import React from 'react';

import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import { convert_json } from 'in-forge/tracing/ios.error/formatter';
import Code from 'in-components/Code';
import { formatDateTime } from 'in-services/formatters/date';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function IosErrorSpanDetailView({ span }) {
  let report;
  try {
    const rawReport = span.getIn(['data', 'ios_error', 'report']);
    if (rawReport != null) {
      report = convert_json(rawReport.toJS());
    }
  } catch (e) {
    // ignore
  }

  return (
    <div>
      <Dl>
        <Di title="App-Name">{span.getIn(['data', 'ios_error', 'report', 'system', 'CFBundleName'])}</Di>

        <Di title="Device">{span.getIn(['data', 'ios_error', 'report', 'system', 'machine'])}</Di>

        <Di title="Model">{span.getIn(['data', 'ios_error', 'report', 'system', 'model'])}</Di>

        <Di title="Crash Date">{formatDateTime(span.getIn(['data', 'ios_error', 'crashTimestamp']))}</Di>

        <Di title="OS Version">{span.getIn(['data', 'ios_error', 'report', 'system', 'system_version'])}</Di>

        <Di title="IP">{span.getIn(['data', 'ios_error', 'ip'])}</Di>

        <Di title="Location">
          <GeoLocation geo={span.getIn(['data', 'ios_error', 'geo'])} />
        </Di>

        {report ? (
          <Di title="Crash Report" verticalDisplay>
            <Code code={report} />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
