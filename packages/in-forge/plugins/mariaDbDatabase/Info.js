/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function MariaDbInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.mariaDbDatabase.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mariaDbDatabase.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mariaDbDatabase.version')}>{getVersion(data)}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.mariaDbDatabase.role')}>{data.get('role')}</DescriptionItem>
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
