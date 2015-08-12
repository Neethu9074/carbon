import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import ProblemPanel from 'in-components/ProblemPanel';
import Collapsible from 'in-components/Collapsible';

import JVMInfo from '../JVMInfo';

const block = 'in-sidebar-server-details';

const Details = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <div className={block}>
        <ProblemPanel snapshot={this.props.snapshot} />

        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>JVM</Collapsible.Header>
          <Collapsible.Content>
            <JVMInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default Details;
