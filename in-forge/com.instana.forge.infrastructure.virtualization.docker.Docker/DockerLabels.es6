

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const DockerLabels = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const labels = this.props.snapshot.getIn(['data', 'Labels']);

    if (labels == null || labels.size === 0) {
      return null;
    }

    return (
      <DescriptionList>
        {labels.map((v, k) =>
          <DescriptionItem title={k}>
            {v}
          </DescriptionItem>
        ).valueSeq().toArray()}
      </DescriptionList>
    );
  }
});

export default DockerLabels;
