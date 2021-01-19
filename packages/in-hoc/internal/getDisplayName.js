/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import recomposeGetDisplayName from 'recompose/getDisplayName';

export function getDisplayName(Component, wrapperName) {
  return `${wrapperName}(${recomposeGetDisplayName(Component)})`;
}
