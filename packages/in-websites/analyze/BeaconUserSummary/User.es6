import { uniq } from 'lodash';
import React from 'react';

import { isNotBlank } from 'in-services/util/string';
import Gravatar from 'in-components/Gravatar';

import locals from './User.mless';

export default function User({ beacon }) {
  const [first, second, third] = uniq(
    [beacon.userName, beacon.userEmail, beacon.userId].filter(Boolean).filter(isNotBlank)
  );
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
