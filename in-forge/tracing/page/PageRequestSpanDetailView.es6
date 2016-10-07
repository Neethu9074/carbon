import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ViewBackendTraceButton from 'in-forge/tracing/page/ViewBackendTraceButton';
import {emptyList} from 'in-services/fixedImmutables';
import {emptyMap} from 'in-services/fixedImmutables';
import Tooltip from 'in-components/Tooltip';


export default function PageRequestSpanDetailView({span}) {
  const backendTraceId = span.getIn(['data', 'page', 'backend_traces'], emptyList).first();

  return (
    <div>
      {backendTraceId ?
        <ViewBackendTraceButton traceId={backendTraceId} />
      : null}

      <DescriptionList>
        <DescriptionItem title='URL'>
          <a href={span.getIn(['data', 'page', 'url'])}
             target='_blank'>
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
          {getLocation(span)}
        </DescriptionItem>

        {getMetaData(span)}
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


function getLocation(span) {
  const geo = span.getIn(['data', 'page', 'geo']);
  if (!geo) {
    return null;
  }

  return (
    <Tooltip content='Geo information by GeoLite2, data created by MaxMind, available from http://www.maxmind.com.'>
      <div>
        {`${geo.get('city')}, ${geo.get('country')} (${geo.get('continent')})`}
      </div>
    </Tooltip>
  );
}
