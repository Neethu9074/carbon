import PropTypes from 'prop-types';

const nodeShape = {
  label: PropTypes.node.isRequired,
  description: PropTypes.node,
  searchable: PropTypes.string,
  icon: PropTypes.string
};
// recursive data structure
nodeShape.children = PropTypes.arrayOf(PropTypes.shape(nodeShape));

export const node = PropTypes.shape(nodeShape);
export const nodeArray = PropTypes.arrayOf(PropTypes.shape(nodeShape));
