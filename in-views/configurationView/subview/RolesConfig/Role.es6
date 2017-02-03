import React from 'react';

import {getRoleConfigLink} from 'in-stores/navigation/configuration';
import {ownerRoleId} from 'in-stores/user';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './Role.less';

const block = 'in-config-role';

export default connectTo(props => {
  return {
    href: getRoleConfigLink(props.role.get('id'))
  };
}, function Role({role, href, onDelete}) {
  return (
    <li className={block}>
      <a href={href}>
        {role.get('name')}
      </a>
      {' '}
      {role.get('id') !== ownerRoleId ?
        <Button onClick={() => onDelete(role)}
                kind='danger'
                size='xs'>
          Delete
        </Button>
      : null}
    </li>
  );
});
