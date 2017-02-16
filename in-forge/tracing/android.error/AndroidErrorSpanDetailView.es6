import React from 'react';
import Code from 'in-components/Code';
import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';

export default function AndroidErrorSpanDetailView({span}) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='App Version Name'>
          {span.getIn(['data', 'android_error', 'report', 'app_version_name'])}
        </DescriptionItem>

        <DescriptionItem title='Android Version'>
          {span.getIn(['data', 'android_error', 'report', 'android_version'])}
        </DescriptionItem>

        <DescriptionItem title='Phone Model'>
          {span.getIn(['data', 'android_error', 'phone_model'])}
        </DescriptionItem>

        <DescriptionItem title='Carrier'>
          {span.getIn(['data', 'android_error', 'report', 'provider'])}
        </DescriptionItem>

        <DescriptionItem title='Network Type'>
          {span.getIn(['data', 'android_error', 'report', 'networkType'])}
        </DescriptionItem>

        <DescriptionItem title='Crash Date'>
          {formatDateTime(span.getIn(['data', 'android_error', 'crashTimestamp']))}
        </DescriptionItem>

        <DescriptionItem title='IP'>
          {span.getIn(['data', 'android_error', 'ip'])}
        </DescriptionItem>

        <DescriptionItem title='Location'>
          <GeoLocation geo={span.getIn(['data', 'android_error', 'geo'])}/>
        </DescriptionItem>

        <DescriptionItem title='Stacktrace'>
          <Code lang='json'
                code={span.getIn(['data', 'android_error', 'report', 'stack_trace'])}/>
        </DescriptionItem>


      </DescriptionList>
    </div>
  );
}

