import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {emptyMap} from 'in-services/fixedImmutables';


export default function PageRequestSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='URL'>
        {span.getIn(['data', 'page', 'url'])}
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

      {getMetaData(span)}
    </DescriptionList>
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
    .map((v, k, i) => {
      return (
        <DescriptionItem title={`Meta Data: ${k}`}
                         key={i}>
          {v}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
