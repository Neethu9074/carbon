/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { emptyMap } from 'in-services/fixedImmutables';

export default function AcceptorsInfo({ snapshot }) {
  const data = snapshot.get('data');
  const acceptors = data.get('acceptors', emptyMap);
  return (
    <DescriptionList>
      {acceptors
        .map((acceptorName, acceptorURI) => (
          <DescriptionItem key={acceptorName} title={acceptorName}>
            {acceptorURI}
          </DescriptionItem>
        ))
        .valueSeq()
        .toArray()}
    </DescriptionList>
  );
}
