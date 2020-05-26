import React from 'react';

import SelectableItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/SelectableItemList';
import { getWebsitesAsResultObservable } from 'in-settings/tabs/TeamSettings/api/websites';
import createApiList from 'in-settings/components/ApiList';

const List = createApiList({
  getItems: getWebsitesAsResultObservable,
  pageSize: 5,
  searchFields: ['label'],
  orderBy: 'label',
  boundedPath: '/websites'
});

export default function Selectable(props) {
  return (
    <SelectableItemList List={List} {...props} toggleItem={website => props.toggleItem(website.id, { website })} />
  );
}
