import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function MariaDbInfo({snapshot}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title='Port'>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {getVersion(data)}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('startedAt'))}
      </DescriptionItem>
      <DescriptionItem title='Role'>
        {data.get('role')}
      </DescriptionItem>
    </DescriptionList>
  );
}

function getVersion(data) {
  const variables = data.get('variables');
  if (!variables) {
    return null;
  }

  const version = variables.get('VERSION');
  const comment = variables.get('VERSION_COMMENTS');

  if (version && comment) {
    return (
      <span>
        {version}
        <br />
        {comment}
      </span>
    );
  } else if (!version && comment) {
    return comment;
  } else if (version && !comment) {
    return version;
  }

  return null;
}
