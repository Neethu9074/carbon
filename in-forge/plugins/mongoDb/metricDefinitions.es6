import {
  number
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'documents.deleted',
      'documents.inserted',
      'documents.returned',
      'documents.updated'
    ],
    labels: [
      'Deleted',
      'Inserted',
      'Returned',
      'Updated'
    ],
    min: 0,
    category: ['Documents'],
    formatter: number
  },
  {
    metric: 'connections',
    label: 'Connections',
    min: 0,
    formatter: number
  }

  // TODO: implement database size metrics
];
