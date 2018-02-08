import stackedArea from 'in-components/Chart/renderer/stackedArea';

export default {
  render: ({ metrics, colors, scale, config }) => {
    colors = colors.slice();
    colors[0] = '#ffffff';
    return stackedArea.render({ metrics, colors, scale, config });
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
  }
};
