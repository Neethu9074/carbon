/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

const data = [
  {
    id: 'd8edc35d-79ca-47a1-b84e-07e85287aeca',
    name: 'Action generated for Something went offline-2',
    description: 'Test offline event',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value: 'CjEuIFVzZSB0aGUgY29tbWFuZCAicG9kbWFuIGluc3BlY3QiIHRvIGNoZWNrIHRoZSBzdGF0dXMgb2YgdGhlIGNvbnRhaW5lci4=',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['watsonx'],
    createdAt: 1725656603.278395,
    modifiedAt: 1725656603.278395,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.34816308690973763,
    confidence: 'high',
    aiEngine: 'NLP'
  },
  {
    id: '75a4384a-7a89-4924-942c-908a22071c3e',
    name: 'Action generated for Something went offline',
    description: 'Test offline event',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value:
          'CjEuIFVzZSB0aGUgY29tbWFuZCAiY3JpbyBvZmZsaW5lIiB0byBjaGVjayBpZiB0aGUgc3lzdGVtIGlzIGluZGVlZCBvZmZsaW5lLg==',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['watsonx'],
    createdAt: 1725555343.65804,
    modifiedAt: 1725555343.65804,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.34816308690973763,
    confidence: 'high',
    aiEngine: 'NLP'
  },
  {
    id: '13748ff3-9ff9-47b4-bbbd-0504b8d433a3',
    name: 'Action generated for Something went offline-1',
    description: 'Test offline event',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value: 'CjEuIFVzZSB0aGUgY29tbWFuZCBgZG9ja2VyIHBzYCB0byBjaGVjayBpZiBhbnkgY29udGFpbmVycyBhcmUgb2ZmbGluZS4=',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['watsonx'],
    createdAt: 1725628292.026009,
    modifiedAt: 1725628292.026009,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.34816308690973763,
    confidence: 'high',
    aiEngine: 'NLP'
  },
  {
    id: 'f3705035-222e-41fc-a44a-c3c63ae33735',
    name: "(Copy of) Fetch host's top CPU consumers_Y7F3d7bWkTuIscrl",
    description: 'This script fetches the top 10 CPU consumers on this host.',
    type: 'SCRIPT',
    fields: [
      {
        name: 'subtype',
        description: 'script subtype',
        encoding: 'base64',
        value: '',
        secured: false
      },
      {
        name: 'script_ssh',
        description: 'script content',
        encoding: 'base64',
        value: 'IyEvYmluL2Jhc2gKcHMgYXV4IC0tc29ydCAtJWNwdSB8IGhlYWQgLTEx',
        secured: false
      },
      {
        name: 'timeout',
        description: 'timeout of the action execution in seconds',
        encoding: 'ascii',
        value: '',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'diagnostic', 'CPU', 'linux', 'watsonx'],
    createdAt: 1721858362.427186,
    modifiedAt: 1721858362.427186,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.31108550841914145,
    confidence: 'high',
    aiEngine: 'NLP'
  },
  {
    id: '2dd836c6-22d3-4abe-9ef0-d3b8e3223b50',
    name: 'Copy of(Remediate a host with low disk space)_Y2sfVj18tTf1ZWRQ',
    description: 'These steps help you diagnose and remediate a host with low disk space.',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value:
          'MS4gVXNlIHRoZSBgZGZgIGNvbW1hbmQgdG8gZGlzcGxheSB0aGUgYW1vdW50IG9mIGRpc2sgc3BhY2UgdXNlZCBhbmQgYXZhaWxhYmxlIG9uIGVhY2ggbW91bnRlZCBmaWxlc3lzdGVtLgoyLiBMb29rIGZvciBwYXR0ZXJucyBpbiBkaXNrIHVzYWdlLCBzdWNoIGFzIHJhcGlkIGluY3JlYXNlcyBpbiB1c2VkIHNwYWNlLgozLiBJZGVudGlmeSBhbmQgcmVtb3ZlIG9sZCBvciB1bnVzZWQgcGFja2FnZSBpbnN0YWxsYXRpb25zLgo0LiBBZGp1c3Qgc3lzdGVtIHNldHRpbmdzLCBzdWNoIGFzIHRoZSBidWZmZXIgc2l6ZSBvciBzd2FwIHNwYWNlLgo1LiBVc2UgYSBkaXNrIHVzYWdlIGFuYWx5emVyIGxpa2UgYG5hdXRpbHVzYCBvciBgZHVgIHRvIGlkZW50aWZ5IGxhcmdlIG9yIHVubmVjZXNzYXJ5IGZpbGVzIGFuZCBkaXJlY3RvcmllcyB0aGF0IGFyZSBjb25zdW1pbmcgc2lnbmlmaWNhbnQgZGlzayBzcGFjZS4gRGVsZXRlIG9yIG1vdmUgdGhlc2UgZmlsZXMgdG8gZnJlZSB1cCBzcGFjZS4KNi4gQ29uc2lkZXIgdXBncmFkaW5nIHlvdXIgc3RvcmFnZSBkZXZpY2UgdG8gYSBsYXJnZXIgY2FwYWNpdHku',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'disk', 'watsonx'],
    createdAt: 1718294394.28539,
    modifiedAt: 1718294394.28539,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.2927700383214887,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: 'a2d914a5-b486-4ba4-a1c5-b653b38fbfa4',
    name: '(Copy of) Diagnose a host with frequent TCP fails-3',
    description: 'These instructions will help you diagnose frequent TCP fails on a host.',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value: 'MS4gQ2hlY2sgZm9yIGNvbm5lY3Rpb25zIHRoYXQgZmFpbGVkIHRvIHN0YXJ0IGZyb20gdGhpcyBuZXR3b3JrIGRldmljZS4=',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'diagnostic', 'tcp', 'watsonx'],
    createdAt: 1717181071.854883,
    modifiedAt: 1717181071.854883,
    score: 0.29277002188460033,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: 'a4888325-fb6a-4f95-b761-ba7497e1c054',
    name: '(Copy of) Diagnose a host with frequent TCP fails',
    description: 'These instructions will help you diagnose frequent TCP fails on a host.',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value: 'MS4gQ2hlY2sgZm9yIGNvbm5lY3Rpb25zIHRoYXQgZmFpbGVkIHRvIHN0YXJ0IGZyb20gdGhpcyBuZXR3b3JrIGRldmljZS4=',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'diagnostic', 'tcp', 'watsonx'],
    createdAt: 1716908426.689537,
    modifiedAt: 1716908426.689537,
    score: 0.29277002188460033,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '24ef4393-d8c7-45e9-a799-1bc911abc697',
    name: '(Copy of) Diagnose a host with frequent TCP errors',
    description: 'These instructions will help you diagnose frequent TCP errors on a host.',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value: 'MS4gQ2hlY2sgZm9yIGJhZCBzZWdtZW50cyByZWNlaXZlZCBpbiB0aGUgbmV0d29yayBkZXZpY2Uu',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'diagnostic', 'tcp', 'watsonx'],
    createdAt: 1716571815.587577,
    modifiedAt: 1716571815.587577,
    score: 0.29277002188460033,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '70fb1b20-392b-4d61-9feb-4c054f918ec5',
    name: 'Action generated for Something went offline-00',
    description: 'This resolves event with Test offline event',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value:
          'MS4gVXNlIHRoZSBjb21tYW5kIGBjb250YWluZXJkIHN0YXR1c2AgdG8gY2hlY2sgdGhlIHN0YXR1cyBvZiB0aGUgY29udGFpbmVyIHJ1bnRpbWUu',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['watsonx'],
    createdAt: 1726627628.501695,
    modifiedAt: 1726627628.501695,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.2886795666464596,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '07b31fc4-bf7b-444d-8005-d7f1f2bebe5c',
    name: 'Copy of(Remediate high CPU system load on a host)_6-WqtPzPOnP0BmNO',
    description: 'These steps help you diagnose and remediate high CPU system load on a host.',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value:
          'MS4gRmV0Y2ggbGlzdCBvZiB0b3AgQ1BVIGNvbnN1bWVycyBvbiB0aGUgaG9zdCB1c2luZyBzeXN0ZW0gY29tbWFuZHMgc3VjaCBhcyBgdG9wYC4KMi4gQ2hlY2sgZm9yIGFueSB1bnVzdWFsIGFjdGl2aXR5IGFuZCBhbnkgcGF0dGVybiB0aGF0IHJlc2VtYmxlcyB0aGUgQ1BVIHNwaWtlIG9uIHRoZSBob3N0LgozLiBUZXJtaW5hdGUgdW5uZWNlc3NhcnkgcHJvY2Vzc2VzIG9yIGFueSBwcm9jZXNzIGNvbnN1bWluZyBhbiB1bnVzdWFsIGhpZ2ggYW1vdW50IG9mIENQVS4KNC4gQ29uc2lkZXIgbW92aW5nIHdvcmtsb2FkcyBpbnRvIGFub3RoZXIgaG9zdCBvciBpbmNyZWFzaW5nIHRoZSBob3N0J3MgQ1BVIGNhcGFjaXR5LiA=',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'CPU', 'watsonx'],
    createdAt: 1718390612.054569,
    modifiedAt: 1718390612.054569,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: false,
      aiOriginated: true,
      ai: null
    },
    score: 0.2738612787526255,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: 'acd28842-4b5b-4099-8232-f2f4c7e19330',
    name: 'bry test 1234',
    description: 'These instructions will help you diagnose frequent TCP errors on a host.',
    type: 'MANUAL',
    fields: [
      {
        name: 'content',
        description: 'Content for manual action',
        encoding: 'base64',
        value: 'MS4gQ2hlY2sgZm9yIGJhZCBzZWdtZW50cyByZWNlaXZlZCBpbiB0aGUgbmV0d29yayBkZXZpY2Uu',
        secured: false
      }
    ],
    inputParameters: [],
    tags: ['host', 'diagnostic', 'tcp', 'watsonx'],
    createdAt: 1717516781.350324,
    modifiedAt: 1717516781.350324,
    score: 0.27216738409811436,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '4f6196c0-b954-386b-a621-2b0f0c938aa1',
    name: 'Get File Space Usage Info on host',
    type: 'ANSIBLE',
    fields: [
      {
        name: 'playbookId',
        description: 'The playbook ID',
        encoding: 'ascii',
        value: '44',
        secured: false
      },
      {
        name: 'playbookFileName',
        description: 'The playbook filename',
        encoding: 'ascii',
        value: 'ansible/host/hostDiskUsageDebug.yaml',
        secured: false
      },
      {
        name: 'ansibleUrl',
        description: 'The ansible url',
        encoding: 'ascii',
        value: 'https://9.66.244.190',
        secured: false
      },
      {
        name: 'hostId',
        description: 'The host ID from which this action is created',
        encoding: 'ascii',
        value: '00:00:0a:ff:fe:15:42:42',
        secured: false
      }
    ],
    createdAt: 1712878652.280075,
    modifiedAt: 1726745701.863438,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: true,
      aiOriginated: false,
      ai: null
    },
    score: 0.25819888976719696,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '5d3cdc03-4cb5-3a3a-9064-152506bf27d3',
    name: 'Get Top Processes Memory Usage on host',
    type: 'ANSIBLE',
    fields: [
      {
        name: 'playbookId',
        description: 'The playbook ID',
        encoding: 'ascii',
        value: '46',
        secured: false
      },
      {
        name: 'playbookFileName',
        description: 'The playbook filename',
        encoding: 'ascii',
        value: 'ansible/host/hostMemoryTopConsumersDebug.yaml',
        secured: false
      },
      {
        name: 'ansibleUrl',
        description: 'The ansible url',
        encoding: 'ascii',
        value: 'https://9.66.244.190',
        secured: false
      },
      {
        name: 'hostId',
        description: 'The host ID from which this action is created',
        encoding: 'ascii',
        value: '00:00:0a:ff:fe:15:42:42',
        secured: false
      }
    ],
    createdAt: 1712878653.152321,
    modifiedAt: 1726745702.000444,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: true,
      aiOriginated: false,
      ai: null
    },
    score: 0.25819888974716115,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '95893fea-ed65-366e-bcf2-19a75905dc6f',
    name: 'Get Top Processes CPU Usage on host',
    type: 'ANSIBLE',
    fields: [
      {
        name: 'playbookId',
        description: 'The playbook ID',
        encoding: 'ascii',
        value: '42',
        secured: false
      },
      {
        name: 'playbookFileName',
        description: 'The playbook filename',
        encoding: 'ascii',
        value: 'ansible/host/hostCPUTopConsumersDebug.yaml',
        secured: false
      },
      {
        name: 'ansibleUrl',
        description: 'The ansible url',
        encoding: 'ascii',
        value: 'https://9.66.244.190',
        secured: false
      },
      {
        name: 'hostId',
        description: 'The host ID from which this action is created',
        encoding: 'ascii',
        value: '00:00:0a:ff:fe:15:42:42',
        secured: false
      }
    ],
    createdAt: 1712878653.141028,
    modifiedAt: 1726745701.990744,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: true,
      aiOriginated: false,
      ai: null
    },
    score: 0.25819888974716115,
    confidence: 'medium',
    aiEngine: 'NLP'
  },
  {
    id: '68ce4660-3960-35aa-8245-9f051eb1e749',
    name: 'cmh-top-cpu-consumers',
    description: 'Get list of top CPU consumers on host',
    type: 'ANSIBLE',
    fields: [
      {
        name: 'playbookId',
        description: 'The playbook ID',
        encoding: 'ascii',
        value: '51',
        secured: false
      },
      {
        name: 'playbookFileName',
        description: 'The playbook filename',
        encoding: 'ascii',
        value: 'ansible/host/hostCPUTopConsumersDebug.yaml',
        secured: false
      },
      {
        name: 'ansibleUrl',
        description: 'The ansible url',
        encoding: 'ascii',
        value: 'https://9.66.244.190',
        secured: false
      },
      {
        name: 'hostId',
        description: 'The host ID from which this action is created',
        encoding: 'ascii',
        value: '00:00:0a:ff:fe:15:42:42',
        secured: false
      }
    ],
    tags: ['cpu', 'diagnostic', 'host', 'watsonx'],
    createdAt: 1712878652.137854,
    modifiedAt: 1726745701.723112,
    metadata: {
      readOnly: false,
      builtIn: false,
      sensorImported: true,
      aiOriginated: false,
      ai: null
    },
    score: 0.23094010767585665,
    confidence: 'medium',
    aiEngine: 'NLP'
  }
];

export const recommendedList = { data, erros: [], progress: { loading: false } };
