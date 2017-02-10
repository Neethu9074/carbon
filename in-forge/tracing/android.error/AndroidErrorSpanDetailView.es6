import React from 'react';
import Code from 'in-components/Code';
import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatTime, formatDate} from 'in-services/formatters/date';

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

        <DescriptionItem title='App Start Date'>
          {formatToDate(span.getIn(['data', 'android_error', 'report', 'user_app_start_date']))}
        </DescriptionItem>

        <DescriptionItem title='IP'>
          {span.getIn(['data', 'android_error', 'ip'])}
        </DescriptionItem>

        <DescriptionItem title='Location'>
          <GeoLocation geo={span.getIn(['data', 'android_error', 'geo'])}/>
        </DescriptionItem>

        <DescriptionItem title='Stacktrace'>
          {formatStacktrace(span)}
        </DescriptionItem>


      </DescriptionList>
    </div>
  );
}

function formatToDate(span) {
  const ts = new Date(span).getTime();
  return formatDate(ts) + " - " + formatTime(ts);
}

function formatStacktrace(span) {
  const {report} = span.getIn(['data', 'android_error']).toJS();

  return (
    <Code
      code={report.stack_trace}/>
  );

}
