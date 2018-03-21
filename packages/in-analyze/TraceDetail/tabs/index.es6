import { traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import Summary from 'in-analyze/TraceDetail/tabs/Summary';

export default [
  {
    label: 'Summary',
    path: `${traceDetailFullyQualified}/tree`,
    component: Summary
  }
];
