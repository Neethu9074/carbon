/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const actionName = 'analyze';

export function getButton({ getHref$ }) {
  return {
    name: actionName,
    icon: 'lib_analyze',
    label: 'View in Analyze',
    getHref$
  };
}
