const minute = 1000 * 60;
const hour = minute * 60;

const presets = [
  {
    windowSize: hour * 24 * 7,
    to: null,
    label: 'Last 7 days'
  },
  {
    windowSize: hour * 24 * 30,
    to: null,
    label: 'Last 30 days'
  },
  {
    windowSize: hour * 24 * 365,
    to: null,
    label: 'Last 365 days'
  }
];

export default presets;
