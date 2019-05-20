import recomposeGetDisplayName from 'recompose/getDisplayName';

export function getDisplayName(Component, wrapperName) {
  return `${wrapperName}(${recomposeGetDisplayName(Component)})`;
}
