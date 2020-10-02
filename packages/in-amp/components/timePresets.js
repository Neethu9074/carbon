import { days } from 'in-services/time';

const presets = [
  {
    windowSize: days.toMillis(7),
    to: null,
    label: 'Last 7 days'
  },
  {
    windowSize: days.toMillis(30),
    to: null,
    label: 'Last 30 days'
  },
  {
    windowSize: days.toMillis(365),
    to: null,
    label: 'Last 365 days'
  }
];

export default presets;
