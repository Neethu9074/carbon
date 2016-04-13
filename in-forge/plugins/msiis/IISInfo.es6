import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const IISInfo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    return (
      <DescriptionList>
        <DescriptionItem title='Version'>
          {data.get('iis.version')}
        </DescriptionItem>
      </DescriptionList>
    );
  }

});

export default IISInfo;
