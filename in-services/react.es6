export function getClassName(reactClass, baseClass, appendix = '') {
  if (reactClass.props.className) {
    return baseClass + appendix + ' ' + reactClass.props.className + appendix;
  }
  return baseClass + appendix;
}
