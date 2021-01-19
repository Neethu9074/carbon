/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Tooltip from 'in-components/Tooltip';

export default function GeoLocation({ geo }) {
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
    <Tooltip content="Geo information by GeoLite2, data created by MaxMind, available from http://www.maxmind.com.">
      <div>{location}</div>
    </Tooltip>
  );
}
