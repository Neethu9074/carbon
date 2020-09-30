import { action } from '@storybook/addon-actions';
import React from 'react';

import { CustomPayload } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/CustomPayloadPage';
import { mockResult } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/form';
import SectionLine from 'in-settings/components/SectionLine';
import Code from 'in-components/Code';

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
  const [payload, setPayload] = React.useState('');
  const successFulSave = payload => {
    setPayload(payload);
  };
  return (
    <>
      <p>With some data of different type.</p>
      <SectionLine />
      <CustomPayload onChange={onChange} result={mockResult} save={successFulSave} />

      <p>Will be filled when saving:</p>
      <Code lang="json" code={JSON.stringify(payload, null, 4)} softWrap showLineNumbers />
    </>
  );
}
