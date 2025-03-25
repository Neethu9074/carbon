/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import IbmMqFileTransferMetadataTable from 'in-events/components/tabs/Summary/IbmMqFileTransferMetadataTable';

export default {
  component: IbmMqFileTransferMetadataTable
};

export const Default = {
  args: {
    ibmMqFileTransferMetadata: [
      {
        transferID: '414d52150xxxxxxxxx523',
        sourceAgent: 'AG1',
        destinationAgent: 'AG2',
        originator: 'root@12.23.45.67',
        status: 'The file transfer request has completed with no files being transferred.',
        details: 'no further details'
      },
      {
        transferID: '414d52150xxxxxxxxx524',
        sourceAgent: 'AG3',
        destinationAgent: 'AG4',
        originator: 'root@12.23.45.68',
        status: 'File transfer is pending - no details.'
      }
    ]
  }
};
