import {get} from 'lodash';
import React from 'react';
import ReactDOM from 'react';
import {createLogger} from 'instalog';

const logger = createLogger('in-client.SignInWithXing');

const rpt = React.PropTypes;

// From Xing to HubSpot
const propMapping = [
  {from: ['id'], to: 'xingid'},
  {from: ['active_email'], to: 'email'},
  {from: ['first_name'], to: 'firstname'},
  {from: ['last_name'], to: 'lastname'},
  {from: ['professional_experience', 'primary_company', 'title'], to: 'jobtitle'},
  {from: ['professional_experience', 'primary_company', 'name'], to: 'company'},
  {from: ['business_address', 'city'], to: 'city'},
  {from: ['business_address', 'country'], to: 'country'},
  {from: ['professional_experience', 'primary_company', 'industry'], to: 'industry'},
  {from: ['permalink'], to: 'xingurl'}
];

const SignInWithXing = React.createClass({

  propTypes: {
    onSignIn: rpt.func.isRequired,
    onError: rpt.func.isRequired,
    className: rpt.string
  },

  shouldComponentUpdate() {
    // we do not permit updates as we do not want to trip up xing
    return false;
  },

  componentDidMount() {
    // yak! What a fricking API is that!? ;-(((
    // https://dev.xing.com/plugins/login_with/docs#get-started
    window.onXingAuthLogin = this.onSignIn;

    const domNode = ReactDOM.findDOMNode(this);

    const xingButtonElement = document.createElement('script');
    xingButtonElement.type = 'xing/login';
    xingButtonElement.innerHTML = JSON.stringify({
      'consumer_key': window.instana.config.keys.xing,
      size: 'xlarge'
    });
    domNode.appendChild(xingButtonElement);

    const xingScriptElement = document.createElement('script');
    xingScriptElement.id = 'lwx';
    xingScriptElement.src = 'https://www.xing-share.com/plugins/login.js';
    domNode.appendChild(xingScriptElement);
  },

  onSignIn({error, user}) {
    if (error === 'USER_LOGGED_OUT' || error === 'INVALID_CONSUMER') {
      // ignore this error. It is okay for users not to be signed into xing
      return;
    } else if (error) {
      const msg = 'Failed to authenticate using Xing';
      logger.error(msg, error);
      this.props.onError(msg);
      return;
    } else if (!user) {
      // this means that the user did not grant us the necessary access rights.
      // We can just ignore this as the popup will continue to stay open.
      return;
    }

    const props = {};
    propMapping.forEach(mapping => {
      const value = get(user, mapping.from, '');
      props[mapping.to] = value;
    });
    this.props.onSignIn(props);
  },

  render() {
    return (
      <div className={this.props.className}></div>
    );
  }
});

export default SignInWithXing;
