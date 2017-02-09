import React from 'react';

import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import {convert_json} from 'in-forge/tracing/ios.error/formatter';
import Code from 'in-components/Code';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function IosErrorSpanDetailView({span}) {
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
      <DescriptionList>
        <DescriptionItem title='App-Name'>
          {span.getIn(['data', 'ios_error', 'report', 'system', 'CFBundleName'])}
        </DescriptionItem>

        <DescriptionItem title='Device'>
          {span.getIn(['data', 'ios_error', 'report', 'system', 'machine'])}
        </DescriptionItem>

        <DescriptionItem title='Model'>
          {span.getIn(['data', 'ios_error', 'report', 'system', 'model'])}
        </DescriptionItem>

        <DescriptionItem title='OS Version'>
          {span.getIn(['data', 'ios_error', 'report', 'system', 'system_version'])}
        </DescriptionItem>

        <DescriptionItem title='IP'>
          {span.getIn(['data', 'ios_error', 'ip'])}
        </DescriptionItem>

        <DescriptionItem title='Location'>
          <GeoLocation geo={span.getIn(['data', 'ios_error', 'geo'])} />
        </DescriptionItem>

        {report ?
          <DescriptionItem title='Crash Report'>
            <Code code={report} />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
}
