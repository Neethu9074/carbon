export const actionName = 'analyze';

export function getButton({ getHref$ }) {
  return {
    name: actionName,
    icon: 'lib_analyze',
    label: 'View in Analyze',
    getHref$
  };
}
