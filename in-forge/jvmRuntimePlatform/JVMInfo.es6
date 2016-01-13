import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatBytes} from 'in-services/converters';

import ClasspathLayouter from './ClasspathLayouter';

const JVMInfo = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const data = this.props.snapshot.get('data');
    const maxMemory = data.get('memory.max');

    return (
      <div>
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
        </DescriptionList>

        <ClasspathLayouter snapshot={this.props.snapshot}/>
      </div>
    );
  }});

export default JVMInfo;
