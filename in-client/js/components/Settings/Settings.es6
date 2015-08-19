import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {setIn, settingsStore} from 'in-services/settings';
import Icon from 'in-components/Icon';

import './Settings.less';

const block = 'in-settings';

const Settings = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    showMenu: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { inverseCheckboxChecked: false };
  },

  componentWillMount() {
    this.addSubscription(settingsStore.subscribe(data => {
      const direction = data.getIn(['map', 'scrollDirection']);
      this.setState({inverseCheckboxChecked: direction === 1 ? false : true});
    }));
  },

  render() {
    return (
      <div className={block + '__wrapper'}>
        <div className={block}>
          <Icon type='delete'
                className={block + '__icon-close'}
                onClick={this.closeSettings}/>

          <span className={block + '__heading'}>settings</span>

          <div>
            <input type='checkbox'
                   defaultChecked={this.state.inverseCheckboxChecked}
                   className={block + '__checkbox'}
                   onClick={(e) => {
                     setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1);
                   }}/>
            {'Inverse scroll direction'}
          </div>

        </div>
      </div>
    );
  },

  closeSettings() {
    this.props.showMenu(false);
  }
});

export default Settings;
