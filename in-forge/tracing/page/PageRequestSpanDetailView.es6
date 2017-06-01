import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import NavigationTiming from 'in-forge/tracing/page/NavigationTiming';
import GeoLocation from 'in-sdk/components/traceDetails/GeoLocation';
import { emptyMap } from 'in-services/fixedImmutables';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      allTracesHref: getTraceViewLinkWithQuery(`span.webEum.pageLoadId:"${props.span.get('traceId')}"`)
    };
  },
  function PageRequestSpanDetailView({ span, allTracesHref }) {
    const timing = span.getIn(['data', 'page', 'timing']);

    return (
      <div>
        <Button href={allTracesHref} className="pull-right" kind="secondary">
          All traces belonging to this page load
        </Button>

        <DescriptionList>
          <DescriptionItem title="Application">
            {span.getIn(['data', 'page', 'appName'])}
          </DescriptionItem>

          <DescriptionItem title="URL">
            <a href={span.getIn(['data', 'page', 'url'])} target="_blank" rel="noopener noreferrer">
              {span.getIn(['data', 'page', 'url'])}
            </a>
          </DescriptionItem>

          <DescriptionItem title="Platform">
            {span.getIn(['data', 'page', 'platform'])}
          </DescriptionItem>

          <DescriptionItem title="Browser">
            {getBrowser(span)}
          </DescriptionItem>

          <DescriptionItem title="Operating System">
            {getOperatingSystem(span)}
          </DescriptionItem>

          <DescriptionItem title="Device">
            {getDevice(span)}
          </DescriptionItem>

          <DescriptionItem title="IP">
            {span.getIn(['data', 'page', 'ip'])}
          </DescriptionItem>

          <DescriptionItem title="Location">
            <GeoLocation geo={span.getIn(['data', 'page', 'geo'])} />
          </DescriptionItem>

          {getMetaData(span)}

          {timing
            ? <DescriptionItem title="Navigation Timing">
                <NavigationTiming {...timing.toJS()} />
              </DescriptionItem>
            : null}
        </DescriptionList>
      </div>
    );
  }
);

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
        <DescriptionItem title={`Meta Data: ${k}`} key={k}>
          {v}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
