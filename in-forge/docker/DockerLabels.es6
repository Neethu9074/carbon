import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import './DockerLabels.less';

const block = 'in-docker-labels';

const DockerLabels = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    labels: irpt.map.isRequired
  },

  render() {
    const labels = this.props.labels;

    return (
      <div>
        {labels.map((v, k) =>
          <div key={k}
               className={block + '__item'}>
            <dt className={block + '__title'}>
              {k}
            </dt>
            <dd className={block + '__text'}>
              {v}
            </dd>
          </div>
        ).valueSeq().toArray()}
      </div>
    );
  }
});

export default DockerLabels;
