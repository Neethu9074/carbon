export function getClassName(reactClass, baseClass) {
  if (reactClass.props.className) {
    return baseClass + ' ' + reactClass.props.className;
  }
  return baseClass;
}
