import React from 'react';

import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import { DescriptionItem } from 'in-components/DescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';

export function getCommonDescriptionItems(span) {
  return [
    <DescriptionItem title="Page" key="page">
      {span.getIn(['data', 'page', 'page'])}
    </DescriptionItem>,

    <DescriptionItem title="Platform" key="platform">
      {span.getIn(['data', 'page', 'platform'])}
    </DescriptionItem>,

    <DescriptionItem title="Browser" key="browser">
      {getBrowser(span)}
    </DescriptionItem>,

    <DescriptionItem title="Operating System" key="os">
      {getOperatingSystem(span)}
    </DescriptionItem>,

    <DescriptionItem title="Device" key="device">
      {getDevice(span)}
    </DescriptionItem>,

    <DescriptionItem title="IP" key="ip">
      {span.getIn(['data', 'page', 'ip'])}
    </DescriptionItem>,

    <DescriptionItem title="Location" key="location">
      <GeoLocation geo={span.getIn(['data', 'page', 'geo'])} />
    </DescriptionItem>,

    getMetaData(span)
  ];
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
  return span
    .getIn(['data', 'page', 'meta'], emptyMap)
    .map((v, k) => {
      return (
        <DescriptionItem title={`Meta Data: ${k}`} key={`meta-${k}`}>
          {v}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
