/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/**
 * validator.js v13.9.0
 *
 * Copyright (c) 2018 Chris O'Hara <cohara87@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { ValidationResult } from 'formalistic';

import isFQDN from 'in-synthetics/createTests/utils/isFQDN';
import isIP from 'in-synthetics/createTests/utils/isIP';
import { t } from 'in-i18n';

/*
  options for urlValidator method:

  require_protocol - if set as true, urlValidator will return error message if protocol is not present in the URL
  require_valid_protocol - urlValidator will check if the URL's protocol is present in the protocols option
  protocols - valid protocols can be modified with this option
  require_host - if set as false, urlValidator will not check if host is present in the URL
  require_port - if set as false, urlValidator will not check if port is present in the URL
  allow_protocol_relative_urls - if set as true, protocol relative URLs will be allowed
  validate_length - if set as false, URL will skip string length validation (IE maximum is 2083, Edge is 2083 but no more than 2048 in the path portion)
*/

const options = {
  protocols: ['http', 'https'],
  require_tld: true,
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  allow_fragments: true,
  allow_query_components: true,
  validate_length: true
};

export default function urlValidator(value: string): ValidationResult {
  if (!value || /[\s<>]/.test(value)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.urlMustNotContainSpace')
      }
    ];
  }

  if (value.indexOf('mailto:') === 0) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.mailToNotSupported')
      }
    ];
  }

  if (options.validate_length && value.length > 2048) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.outOfLength')
      }
    ];
  }

  if (!options.allow_fragments && value.includes('#')) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.fragmentsNotSupported')
      }
    ];
  }

  if (!options.allow_query_components && (value.includes('?') || value.includes('&'))) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.queryNotSupported')
      }
    ];
  }

  let protocol: string, auth: string, host: string, hostname: string, port: number, port_str: string, split: string[];

  // e.g.: http://foobar.com/?foo=bar#baz=qux
  split = value.split('#'); // split = ['http://foobar.com/?foo=bar', 'baz=qux']
  value = split.shift() ?? ''; // value = 'http://foobar.com/?foo=bar'

  split = value.split('?'); // split = ['http://foobar.com/', 'foo=bar']
  value = split.shift() ?? ''; // value = 'http://foobar.com/'

  split = value.split('://'); // split = ['http', 'foobar.com/']

  if (split.length > 1) {
    // case for incorrect protocol
    protocol = split.shift()?.toLocaleLowerCase() ?? '';
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createTest.validators.incorrectProtocol')
        }
      ];
    }
  } else if (options.require_protocol) {
    // either miss protocol or domian
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.incorrectUrlFormat')
      }
    ];
  }

  value = split.join('://');

  split = value.split('/');
  value = split.shift() ?? '';

  if (value === '' && !options.require_host) {
    return undefined;
  }

  // e.g. value = 'user:pass@www.foobar.com:65535'
  split = value.split('@'); // split: ['user:pass', 'www.foobar.com:65535']
  if (split.length > 1) {
    if (split[0] === '') {
      return [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createTest.validators.missUserAuthentication')
        }
      ];
    }
    auth = split.shift() ?? ''; // split: ['www.foobar.com:65535']
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createTest.validators.incorrectAuthentication')
        }
      ];
    }
    const [user, password]: string[] = auth.split(':');
    if (user === '' || password === '') {
      return [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createTest.validators.missUserOrPassword')
        }
      ];
    }
  }

  hostname = split.join('@'); // e.g: 'www.foobar.com:65535'

  port_str = '';
  split = hostname.split(':'); // split: ['www.foobar.com','65535']
  host = split.shift() ?? ''; // split: ['65535']
  if (split.length) {
    port_str = split.join(':');
  }

  if (port_str != '' && port_str.length > 0) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createTest.validators.invalidPortValue')
        }
      ];
    }
  }

  if (host === '' && options.require_host) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.missHost')
      }
    ];
  }

  if (!isIP(host) && !isFQDN(host)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.invalidHost')
      }
    ];
  }
  return undefined;
}
