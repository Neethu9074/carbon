/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';

const nodeShape = {
  label: PropTypes.node.isRequired,
  description: PropTypes.node,
  badge: PropTypes.node,
  keywords: PropTypes.string,
  icon: PropTypes.string
};
// recursive data structure
nodeShape.children = PropTypes.arrayOf(PropTypes.shape(nodeShape));

export const node = PropTypes.shape(nodeShape);
export const nodeArray = PropTypes.arrayOf(PropTypes.shape(nodeShape));
