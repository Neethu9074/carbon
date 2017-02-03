import React from 'react';

import {getRoleConfigLink} from 'in-stores/navigation/configuration';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    href: getRoleConfigLink(props.role.get('id'))
  };
}, function Role({role, href}) {
  return (
    <li>
      <a href={href}>
        {role.get('name')}
      </a>
    </li>
  );
});
