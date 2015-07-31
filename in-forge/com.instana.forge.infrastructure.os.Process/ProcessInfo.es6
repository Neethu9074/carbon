'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const ProcessInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title='Executable'>
          {data.get('exec')}
        </DescriptionItem>
        <DescriptionItem title='Arguments'>
          <ul>
            {data.get('args').map((arg, i) =>
              <li style={{'whiteSpace': 'nowrap'}}
                  key={i}>
                {arg}
              </li>
            ).toArray()}
          </ul>
        </DescriptionItem>
      </DescriptionList>
    );
  }
});

export default ProcessInfo;
