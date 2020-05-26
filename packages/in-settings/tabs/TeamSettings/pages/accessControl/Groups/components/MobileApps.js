import React from 'react';

import SelectableItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/SelectableItemList';
import { getMobileAppsAsResultObservable } from 'in-settings/tabs/TeamSettings/api/mobileApps';
import createApiList from 'in-settings/components/ApiList';

const List = createApiList({
  getItems: getMobileAppsAsResultObservable,
  pageSize: 5,
  searchFields: ['label'],
  orderBy: 'label',
  boundedPath: '/clusters'
});

export default function Selectable(props) {
  return (
    <SelectableItemList
      List={List}
      {...props}
      toggleItem={mobileApp => props.toggleItem(mobileApp.id, { mobileApp })}
    />
  );
}
