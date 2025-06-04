/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonTabs,
  CarbonTabList,
  CarbonTab,
  CarbonTabPanel,
  CarbonTabPanels,
  CarbonContainedList,
  CarbonContainedListItem
} from '@instana/components';

import locals from './PromptLibrary.mless';

// import { t } from 'in-i18n';


const PromptLibrary = ({ instance }) => {
  return (
    <div id="promptLibrary">
      <CarbonTabs onTabCloseRequest={() => {console.log('close')}}>
        <CarbonTabList scrollDebounceWait={200} >
          <CarbonTab>
            Applications
          </CarbonTab>
          <CarbonTab>
            Infrastructure
          </CarbonTab>
        </CarbonTabList>
        <CarbonTabPanels>
          <CarbonTabPanel>
            <CarbonContainedList kind="on-page" size="lg" >
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
                {"Show me calls with high latency for service <service-name> in app <app-name>"}
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
                {"Show me erroneous calls for service <service-a>"}
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
                {"Show me calls with status code 5XX received by <service-a>"}
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
                {"Show me calls which spiked in last <duration> minutes in <service-a> "}
              </CarbonContainedListItem>
            </CarbonContainedList>
          </CarbonTabPanel>
          <CarbonTabPanel>
            <CarbonContainedList kind="on-page" size="lg">
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
                Show total number of failed queries to db2 database with host name ABC
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
              Get the total number of runnable threads, new threads, and threads in timed-waiting for all JVMs running on namespace XYZ.
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
              Show top 3 queues with highest queue depth for last 60 minutes group by queue name.
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
              What is the sum of aggregated cpu requests for kubernetes deployment APP-1 in namespace NAMESPACE-1 for last 2 hours?
              </CarbonContainedListItem>
              <CarbonContainedListItem onClick={() => {console.log('app')}}>
              What is the count of pods for deployments labeled as environment=envABC in the namespace nameXYZ?
              </CarbonContainedListItem>
            </CarbonContainedList>
          </CarbonTabPanel>
      </CarbonTabPanels>
      </CarbonTabs>

    </div>
  );
};

export default PromptLibrary;
