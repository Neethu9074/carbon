import theme from 'in-themes';

export function getColorWithTransparency(color) {
  const color25Index = theme.lib.colors.chart.strokeColors25.indexOf(color);
  if (color25Index >= 0) {
    return {
      c25: color,
      c50: theme.lib.colors.chart.strokeColors50[color25Index],
      c100: theme.lib.colors.chart.strokeColors100[color25Index]
    };
  }

  const color50Index = theme.lib.colors.chart.strokeColors50.indexOf(color);
  if (color50Index >= 0) {
    return {
      c25: theme.lib.colors.chart.strokeColors25[color50Index],
      c50: color,
      c100: theme.lib.colors.chart.strokeColors100[color50Index]
    };
  }

  const color100Index = theme.lib.colors.chart.strokeColors100.indexOf(color);
  if (color100Index >= 0) {
    return {
      c25: theme.lib.colors.chart.strokeColors25[color100Index],
      c50: theme.lib.colors.chart.strokeColors50[color100Index],
      c100: color
    };
  }

  if (color === theme.lib.colors.chart.self25 || color === theme.lib.colors.chart.self100) {
    return {
      c25: theme.lib.colors.chart.self25,
      c50: theme.lib.colors.chart.self25,
      c100: theme.lib.colors.chart.self100
    };
  }

  return {
    c25: color,
    c50: color,
    c100: color
  };
}
