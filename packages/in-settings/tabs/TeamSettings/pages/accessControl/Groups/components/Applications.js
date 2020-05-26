import React from 'react';

import SelectableItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/SelectableItemList';
import { getApplicationConfigsAsResultObservable } from 'in-api/applicationConfigs';
import createApiList from 'in-settings/components/ApiList';

const List = createApiList({
  getItems: getApplicationConfigsAsResultObservable,
  pageSize: 5,
  searchFields: ['label'],
  orderBy: 'label',
  boundedPath: '/applications'
});

export default function Selectable(props) {
  return (
    <SelectableItemList
      List={List}
      {...props}
      toggleItem={application => props.toggleItem(application.id, { application })}
    />
  );
}
