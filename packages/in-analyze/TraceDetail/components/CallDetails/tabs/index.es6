import StackTrace from 'in-analyze/TraceDetail/components/CallDetails/tabs/StackTrace/StackTrace';
import Summary from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/Summary';
import Details from 'in-analyze/TraceDetail/components/CallDetails/tabs/Details/Details';

export default [
  {
    label: 'Summary',
    component: Summary
  },
  {
    label: 'Details',
    component: Details
  },
  /*
  {
    label: 'Infrastructure',
    component: Infrastructure
  },*/
  {
    label: 'Stack Trace',
    component: StackTrace
  }
];
