import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import NavigationTiming from 'in-forge/tracing/page/NavigationTiming';
import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import {emptyMap} from 'in-services/fixedImmutables';


export default function PageRequestSpanDetailView({span}) {
  const timing = span.getIn(['data', 'page', 'timing']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Application'>
          {span.getIn(['data', 'page', 'appName'])}
        </DescriptionItem>

        <DescriptionItem title='URL'>
          <a href={span.getIn(['data', 'page', 'url'])}
             target='_blank'
             rel='noopener noreferrer'>
            {span.getIn(['data', 'page', 'url'])}
          </a>
        </DescriptionItem>

        <DescriptionItem title='Platform'>
          {span.getIn(['data', 'page', 'platform'])}
        </DescriptionItem>

        <DescriptionItem title='Browser'>
          {getBrowser(span)}
        </DescriptionItem>

        <DescriptionItem title='Operating System'>
          {getOperatingSystem(span)}
        </DescriptionItem>

        <DescriptionItem title='Device'>
          {getDevice(span)}
        </DescriptionItem>

        <DescriptionItem title='IP'>
          {span.getIn(['data', 'page', 'ip'])}
        </DescriptionItem>

        <DescriptionItem title='Location'>
          <GeoLocation geo={span.getIn(['data', 'page', 'geo'])} />
        </DescriptionItem>

        {getMetaData(span)}

        {timing ?
          <DescriptionItem title='Navigation Timing'>
            <NavigationTiming {...timing.toJS()} />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
}


function getBrowser(span) {
  return getNameVersionPair(span, 'browser');
}


function getOperatingSystem(span) {
  return getNameVersionPair(span, 'os');
}


function getDevice(span) {
  const name = span.getIn(['data', 'page', 'userAgent', 'device', 'model']);
  const type = span.getIn(['data', 'page', 'userAgent', 'device', 'type']);
  const vendor = span.getIn(['data', 'page', 'userAgent', 'device', 'vendor']);

  const deviceParameters = [name, type, vendor].filter(s => !!s);
  if (deviceParameters.length === 0) {
    return undefined;
  }
  return deviceParameters.join(' ');
}


function getNameVersionPair(span, key) {
  const name = span.getIn(['data', 'page', 'userAgent', key, 'name']);
  if (!name) {
    return undefined;
  }

  const version = span.getIn(['data', 'page', 'userAgent', key, 'version']);
  if (!version) {
    return name;
  }

  return `${name} ${version}`;
}


function getMetaData(span) {
  return span.getIn(['data', 'page', 'meta'], emptyMap)
    .map((v, k) => {
      return (
        <DescriptionItem title={`Meta Data: ${k}`}
                         key={k}>
          {v}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
