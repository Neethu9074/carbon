import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {setIn, settingsStore} from 'in-services/settings';
import * as tracking from 'in-services/tracking';
import CheckBox from 'in-components/CheckBox';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-components/Button';
import Slider from 'in-components/Slider';
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
      inverseCheckboxChecked: false,
      antialiasValue: 'off',
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
        antialiasValue: antialias ? antialias : 'off'
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


          <CheckBox label={'Inverse scroll direction'}
                    onClick={(e) => {
                     setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1);
                    }}
                    defaultChecked={this.state.inverseCheckboxChecked}/>

          <Slider label={' Scroll speed: ' + this.state.speedSliderValue}
                  onChange={(e) => setIn(['map', 'scrollSpeed'], e.target.value)}
                  min={0.1}
                  max={20}
                  defaultValue={this.state.speedSliderValue}/>

          <ComboBox label={'Antialias'}
                    onChange={this.antialiasChanged}
                    defaultValue={this.state.antialiasValue}>
            {'off'}
            {'browserAA'}
            {'FXAA'}
          </ComboBox>

        </div>
      </Dialog>
    );
  },

  antialiasChanged(event) {
    const value = event.target.value;

    // sets AA true if on value other than 'none' was chosen
    setIn(['map', 'antialias'], value);

    //track the event
    tracking.trackEvent(tracking.events.antialiasWasChosenInSettings);
  },

  closeSettings() {
    this.props.showMenu(false);
  }
});

export default Settings;
