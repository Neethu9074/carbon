/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { TimeConfig, TagFilter } from '@instana/types';

import CustomEvents from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents/CustomEvents';
import CustomEvent from 'in-mobile-apps/MobileAppDashboard/tabs/CustomEvents/CustomEvent';

export interface CustomEventIndexProp {
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: TimeConfig;
  tagFilters: Array<TagFilter>;
  location: any;
}

export default function CustomEventIndex(props: CustomEventIndexProp) {
  return (
    <Switch>
      <Route path="*/details">
        <CustomEvent {...props} />
      </Route>
      <Route path="*">
        <CustomEvents {...props} />
      </Route>
    </Switch>
  );
}
