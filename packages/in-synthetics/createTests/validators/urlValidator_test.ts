/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { t } from '@instana/i18n-react';

import urlValidator from 'in-synthetics/createTests/validators/urlValidator';

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('http://www.foobar.com/')).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('HTTPS://WWW.FOOBAR.COM/')).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('http://xn------eddceddeftq7bvv7c4ke4c.xn--p1ai')).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator("http://foobar.com/t$-_.+!*'(),")).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('http://1337.com')).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('http://example.com/example.json#/foo/bar')).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('http://duckduckgo.com/?q=%2F')).toStrictEqual(undefined);
});

test('validates an input URL, and return undefined value if input URL is valid', () => {
  expect(urlValidator('http://127.0.0.1/')).toStrictEqual(undefined);
});

test('validates an input URL, and return an error message if input URL contains space', () => {
  expect(urlValidator('')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.urlMustNotContainSpace')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL uses mailTo', () => {
  expect(urlValidator('mailto:foo@bar.com')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.mailToNotSupported')
    }
  ]);
});

const longArray: string = new Array(2049).join('f');
test("validates an input URL, and return an error message if input URL's length exceeds 2048", () => {
  expect(urlValidator('http://foobar.com/' + longArray)).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.outOfLength')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL uses incorrect protocol', () => {
  expect(urlValidator('htt://www.google.com')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.incorrectProtocol')
    }
  ]);
});

test("validates an input URL, and return an error message if input URL doesn't contain protocol", () => {
  expect(urlValidator('www.google.com')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.incorrectUrlFormat')
    }
  ]);
});

test("validates an input URL, and return an error message if input URL doesn't contain protocol", () => {
  expect(urlValidator('//foobar.com')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.incorrectUrlFormat')
    }
  ]);
});

test("validates an input URL, and return an error message if input URL contains '@' but no authentication value", () => {
  expect(urlValidator('http://@foobar.com')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.missUserAuthentication')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL uses wrong authenticaion format', () => {
  expect(urlValidator('http://user:passd:passd2@foobar.com')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.incorrectAuthentication')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL misses part of authentication', () => {
  expect(urlValidator('http://lol:@foobar.com/')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.missUserOrPassword')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL has invalid port value', () => {
  expect(urlValidator('http://www.foobar.com:99999/')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.invalidPortValue')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL has no host', () => {
  expect(urlValidator('http://')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.missHost')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL has invalid host', () => {
  expect(urlValidator('http://www.foobar-this-is-an-invalidurl!!!!')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.invalidHost')
    }
  ]);
});

test('validates an input URL, and return an error message if input URL has invalid host', () => {
  expect(urlValidator('HTTP://domain.com�')).toStrictEqual([
    {
      severity: 'error',
      message: t('in-synthetics:dialog.createTest.validators.invalidHost')
    }
  ]);
});
