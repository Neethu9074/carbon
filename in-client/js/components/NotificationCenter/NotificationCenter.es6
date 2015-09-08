import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as timelineStore from 'in-services/stores/timeline';
import {getIssues} from 'in-services/issueTracker';
import enhance from 'in-components/hoc/enhance';

import './NotificationCenter.less';

const block = 'in-notificationcenter';
const rpt = React.PropTypes;

const NotificationCenter = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    timeframe: rpt.number.isRequired,
    openIssues: irpt.list
  },

  statics: {
    createObservables() {
      return {
        timeframe: timelineStore.timeframe,
        openIssues: getIssues().debounce(500)
      };
    }
  },

  render() {
    return (
      <div className={block}>

        <div className={block + '__header'}>
          {'Notifications'}
          {'BACK'}
        </div>

        <div className={block + '__status-bar'}>
          {'ALL'}
          {'1'}
          {'2'}
          {'3'}
        </div>

        <div className={block + '__list'}>

        </div>

      </div>
    );
  }
});

export default enhance(NotificationCenter);
