import { uniq, find } from 'lodash';
import React from 'react';

import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Gravatar from 'in-components/Gravatar';

import locals from './User.mless';

export default function User({ beacon, beacons }) {
  beacons = beacons || [beacon];

  let [first, second, third] = uniq(
    [getValue(beacons, 'userName'), getValue(beacons, 'userEmail'), getValue(beacons, 'userId')]
      .filter(Boolean)
      .filter(isNotBlank)
  );

  if (!first) {
    first = (
      <div className={locals.noUserData}>
        No user data defined
        <Button
          href="https://docs.instana.io/products/website_monitoring/api/#identifying-users"
          kind="primaryv2"
          target="_blank"
          size="compact"
        >
          Learn how to add user data
        </Button>
      </div>
    );
  }

  return (
    <div className={locals.user}>
      <Gravatar email={beacon.email} className={locals.avatar} />
      <div className={locals.info}>
        {first && <div className={locals.first}>{first}</div>}
        {second && <div className={locals.second}>{second}</div>}
        {third && <div className={locals.third}>{third}</div>}
      </div>
    </div>
  );
}

function getValue(beacons, field) {
  const beacon = find(beacons, b => isNotBlank(b[field]));
  return beacon ? beacon[field] : undefined;
}
