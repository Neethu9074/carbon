'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Collapsible from 'in-components/Collapsible';
import ProblemPanel from 'in-components/ProblemPanel';

import ProcessInfo from '../ProcessInfo';
import ArgList from '../ArgList';

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
          <Collapsible.Header>Host</Collapsible.Header>
          <Collapsible.Content>
            <ProcessInfo snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Arguments</Collapsible.Header>
          <Collapsible.Content>
            <ArgList snapshot={this.props.snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default Details;
