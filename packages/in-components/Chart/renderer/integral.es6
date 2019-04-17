import stackedArea from 'in-components/Chart/renderer/stackedArea';

export default {
  render: ({ metrics, colors, colors100, scale, config, axis }) => {
    colors = colors.slice();
    colors[0] = '#ffffff';
    return stackedArea.render({ metrics, colors, colors100, scale, axis, config });
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
  }
};
