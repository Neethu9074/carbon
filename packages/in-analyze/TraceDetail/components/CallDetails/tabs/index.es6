import Infrastructure from 'in-analyze/TraceDetail/components/CallDetails/tabs/Infrastructure';
import StackTrace from 'in-analyze/TraceDetail/components/CallDetails/tabs/StackTrace';
import Summary from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary';
import Details from 'in-analyze/TraceDetail/components/CallDetails/tabs/Details';

export default [
  {
    label: 'Summary',
    component: Summary
  },
  {
    label: 'Details',
    component: Details
  },
  {
    label: 'Infrastructure',
    component: Infrastructure
  },
  {
    label: 'Stack Trace',
    component: StackTrace
  }
];
