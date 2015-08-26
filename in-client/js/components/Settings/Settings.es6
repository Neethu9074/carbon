import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {setIn, settingsStore} from 'in-services/settings';
// import * as tracking from 'in-services/tracking';
import Button from 'in-components/Button';
import Dialog from 'in-components/Dialog';

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
    return {
      antialiasValue: 'none',
      inverseCheckboxChecked: false,
      speedSliderValue: 1
    };
  },

  componentWillMount() {
    this.addSubscription(settingsStore.subscribe(data => {
      const direction = data.getIn(['map', 'scrollDirection']);
      const antialias = data.getIn(['map', 'antialias']);
      this.setState({
        inverseCheckboxChecked: direction === 1 ? false : true,
        speedSliderValue: data.getIn(['map', 'scrollSpeed']),
        antialiasValue: antialias ? 'on' : 'off'
      });
    }));
  },

  render() {
    return (
      <Dialog>
        <div className={block}>
          <div className={block + '__heading'}>
            <span className={block + '__heading-text'}>
              {'Settings'}
            </span>

            <Button onClick={this.closeSettings}
                    className={block + '__button-close'}>
              {'Close'}
            </Button>
          </div>

          <div className={block + '__setting'}>
            <input type='checkbox'
                   defaultChecked={this.state.inverseCheckboxChecked}
                   className={block + '__checkbox'}
                   onClick={(e) => {
                     setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1);
                   }}/>
            {'Inverse scroll direction'}
          </div>

          <div className={block + '__setting'}>
            <input type='range'
                   className={block + '__range'}
                   min={0.1}
                   max={20}
                   step={0.1}
                   defaultValue={this.state.speedSliderValue}
                   onChange={(e) => setIn(['map', 'scrollSpeed'], e.target.value)}/>
            {' Scroll speed: ' + this.state.speedSliderValue}
          </div>

          <div className={block + '__setting'}>
            {'Antialias'}
            <select className={block + '__select'}
                    onChange={this.antialiasChanged}
                    defaultValue={this.state.antialiasValue}>
              <option value='off'>off</option>
              <option value='on'>on</option>
            </select>
          </div>

        </div>
      </Dialog>
    );
  },

  antialiasChanged(event) {
    const value = event.target.value;

    // sets AA true if on value other than 'none' was chosen
    setIn(['map', 'antialias'], value !== 'off');

    // tracking.trackEvent(tracking.events.antialiasWasChosenInSettings);
  },

  closeSettings() {
    this.props.showMenu(false);
  }
});

export default Settings;
