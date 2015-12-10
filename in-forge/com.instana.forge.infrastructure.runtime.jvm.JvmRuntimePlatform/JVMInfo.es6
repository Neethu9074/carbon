

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {formatBytes} from 'in-services/converters';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

const JVMInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const maxMemory = data.get('memory.max');

    return (
      <DescriptionList>
        <DescriptionItem title='Java Version'>
          {data.get('jvm.version')}{' '}
          {data.get('jvm.build')}
        </DescriptionItem>

        <DescriptionItem title='Java Runtime'>
          {data.get('jvm.vendor')}<br/>
          {data.get('jvm.name')}
        </DescriptionItem>

        {maxMemory ?
          <DescriptionItem title='Maximum Heap'>
            {formatBytes(maxMemory)}
          </DescriptionItem> :
          null
        }

        <DescriptionItem title='Classpath'>
          {this.formatClasspath(data.get('jvm.cp'))}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  formatClasspath(cp) {
    if (!cp) {
      return null;
    }

    const cpEntries = cp.split(/:|;/);
    return (
      <span>
        {cpEntries.map((cpEntry) =>
          <div key={cpEntry}>
            {cpEntry}
          </div>
        )}
      </span>
    );
  }
});

export default JVMInfo;
