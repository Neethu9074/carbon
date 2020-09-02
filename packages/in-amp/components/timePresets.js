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
  }
];

export default presets;
