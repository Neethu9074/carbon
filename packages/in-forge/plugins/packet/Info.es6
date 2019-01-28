import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import KeyValuePopupButton from 'in-sdk/components/sidebar/KeyValuePopupButton';
import { emptyMap } from 'in-services/fixedImmutables';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const tags = data.get('tags', emptyMap);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Hostname">{data.get('hostname')}</DescriptionItem>

        <DescriptionItem title="ID">{data.get('id')}</DescriptionItem>

        <DescriptionItem title="IQN">{data.get('iqn')}</DescriptionItem>

        <DescriptionItem title="Facility">{data.get('facility')}</DescriptionItem>

        <DescriptionItem title="Plan">{data.get('plan')}</DescriptionItem>
      </DescriptionList>

      {tags.size > 0 ? (
        <KeyValuePopupButton title="Tags" data={tags}>
          Tags
        </KeyValuePopupButton>
      ) : null}
    </div>
  );
}
