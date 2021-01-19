/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
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
