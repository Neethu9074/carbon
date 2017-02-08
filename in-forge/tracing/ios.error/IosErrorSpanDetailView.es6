import React from 'react';

import Code from 'in-components/Code';
import {convert_json} from './formater';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {emptyMap} from 'in-services/fixedImmutables';
import Tooltip from 'in-components/Tooltip';


export default function IosErrorSpanDetailView({span}) {

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
          {getLocation(span)}
        </DescriptionItem>

        <DescriptionItem title='Crash Report'>
          {getCrashReport(span)}
        </DescriptionItem>



      </DescriptionList>
    </div>
  );
}

function getLocation(span) {
  const geo = span.getIn(['data', 'ios_error', 'geo']);
  if (!geo) {
    return null;
  }

  let location = '';

  const city = geo.get('city');
  const country = geo.get('country');
  const continent = geo.get('continent');

  if (city) {
    location = city;
  }

  if (country) {
    if (city) {
      location += ', ';
    }
    location += country;
  }

  if (continent) {
    location += ` (${continent})`;
  }

  return (
    <Tooltip content='Geo information by GeoLite2, data created by MaxMind, available from http://www.maxmind.com.'>
      <div>
        {location}
      </div>
    </Tooltip>
  );
}

function getCrashReport(span){
  const report = convert_json(span.getIn(['data', 'ios_error', 'report']).toJS());
  return (
    <Code
    code={report}/>
  );
}
