import React from 'react';

export default function Role({role}) {
  return (
    <li>
      {role.get('name')}
    </li>
  );
}
