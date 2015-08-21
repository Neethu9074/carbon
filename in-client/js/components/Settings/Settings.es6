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
        antialiasValue: antialias ? 'simple' : 'none'
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
              <option value='none'>none</option>
              <option value='simple'>simple</option>
              <option value='2x SSAA'>2x SSAA</option>
              <option value='4x SSAA'>4x SSAA</option>
              <option value='8x SSAA'>8x SSAA</option>
              <option value='2x MSAA'>2x MSAA</option>
              <option value='4x MSAA'>4x MSAA</option>
              <option value='4x MSAA + 2x SSAA'>4x MSAA + 2x SSAA</option>
              <option value='8x MSAA'>8x MSAA</option>
              <option value='16x MSAA'>16x MSAA</option>
              <option value='4x CSAA'>4x CSAA</option>
              <option value='8x CSAA'>8x CSAA</option>
              <option value='16x CSAA'>16x CSAA</option>
              <option value='32x CSAA'>32x CSAA</option>
              <option value='4x MSAA + 8x CSAA'>4x MSAA + 8x CSAA</option>
              <option value='8x MSAA + 8x CSAA'>8x MSAA + 8x CSAA</option>
              <option value='4x MSAA + 16x CSAA'>4x MSAA + 16x CSAA</option>
              <option value='16x MSAA + 4x SSAA'>16x MSAA + 4x SSAA</option>
              <option value='8x MSAA + 16x CSAA'>8x MSAA + 16x CSAA</option>
              <option value='8x MSAA + 32x CSAA'>8x MSAA + 32x CSAA</option>
              <option value='32 MSAA + 4x SSAA'>32 MSAA + 4x SSAA</option>
            </select>
          </div>

        </div>
      </Dialog>
    );
  },

  antialiasChanged(event) {
    const value = event.target.value;

    // sets AA true if on value other than 'none' was chosen
    setIn(['map', 'antialias'], value !== 'none');

    // tracking.trackEvent(tracking.events.antialiasWasChosenInSettings);
  },

  closeSettings() {
    this.props.showMenu(false);
  }
});

export default Settings;
