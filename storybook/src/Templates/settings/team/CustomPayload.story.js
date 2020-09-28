import { action } from '@storybook/addon-actions';
import React from 'react';

import { CustomPayload } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/CustomPayloadPage';
import { mockResult } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/form';

const onChange = action('onChange');

export default {
  title: 'Organisms|CustomPayloadPage',
  component: CustomPayload
};

export function Pending() {
  return (
    <>
      <p>Visualizes how the form looks like when it is in the process of retrieving data from the server.</p>
      <CustomPayload
        result={{
          progress: {
            loading: true
          },
          errors: []
        }}
      />
    </>
  );
}

export function Failed_Data_Retrieval() {
  return (
    <>
      <p>The following table visualizes what a table looks like when data retrieval has failed.</p>
      <CustomPayload
        onChange={onChange}
        result={{
          progress: {
            loading: false
          },
          errors: [
            {
              message: 'Unexpected server error',
              code: 'SERVER'
            }
          ]
        }}
      />
    </>
  );
}

export function Empty() {
  return (
    <>
      <p>When no values are configured, then the table looks like this.</p>
      <CustomPayload
        onChange={onChange}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: []
          }
        }}
      />
    </>
  );
}

export function WithAllTypesOfData() {
  return (
    <>
      <p>With some data of different type.</p>
      <CustomPayload onChange={onChange} result={mockResult} />
    </>
  );
}
