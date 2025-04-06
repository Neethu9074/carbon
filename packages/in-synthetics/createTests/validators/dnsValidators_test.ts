/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  lookupValidator,
  IPv4Validator,
  IPv6Validator,
  dnsServerValidator,
  assertionValidator,
  responseTimeValidator,
  noSpaceValidator,
  checkQueryTypeAssertionMismatch
} from 'in-synthetics/createTests/validators/dnsValidators';
import { getErrorMessage } from 'in-services/validators/jsonType';
import { t } from 'in-i18n';

describe('lookupValidator', () => {
  test('validates a DNS lookup , and return undefined value if input lookup is valid', () => {
    expect(lookupValidator('google.com')).toStrictEqual(undefined);
    expect(lookupValidator('www.google.com')).toStrictEqual(undefined);
    expect(lookupValidator('www.google.co.in')).toStrictEqual(undefined);
    expect(lookupValidator('www.google.com.co.in')).toStrictEqual(undefined);
    expect(lookupValidator('123google.com')).toStrictEqual(undefined);
    expect(lookupValidator('http://www.google.com')).toStrictEqual(undefined);
    expect(lookupValidator('https://www.google.com')).toStrictEqual(undefined);
    expect(lookupValidator('http://www.google.co.in')).toStrictEqual(undefined);
  });

  test('validates a DNS lookup, and return an error message if input lookup starts with a hyphen or period', () => {
    expect(lookupValidator('-www.google.com')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ]);
    expect(lookupValidator('.www.google.com')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ]);
  });

  test('validates a DNS lookup, and return an error message if input lookup have missing top-level domain (TLD)', () => {
    expect(lookupValidator('google')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ]);
  });

  test('validates a DNS lookup, and return an error message if input lookup ends with a hyphen or period', () => {
    expect(lookupValidator('www.google.com-')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ]);
    expect(lookupValidator('www.google.com.')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ]);
  });

  test('validates a DNS lookup, and return an error message if input lookup have special characters', () => {
    expect(lookupValidator('www.goo$gle.com')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ]);
  });

  test('validates a DNS lookup, and return an error message if any of the label within input lookup lenght is greater than 63', () => {
    expect(lookupValidator('www.googlegooglegooglegooglegooglegooglegooglegooglegooglegooglegoogle.com')).toStrictEqual(
      [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
        }
      ]
    );
    expect(lookupValidator('www.googlegooglegooglegooglegooglegooglegooglegooglegooglegoogle.com')).toStrictEqual(
      undefined
    );
  });
});

describe('dnsServerValidator', () => {
  test('validates the DNS server and return undefined value if input server is either a valid IP address or a FQDN', () => {
    expect(dnsServerValidator('example.com')).toStrictEqual(undefined);
    expect(dnsServerValidator('www.example.com')).toStrictEqual(undefined);
    expect(dnsServerValidator('37.235.1.174')).toStrictEqual(undefined);
    expect(dnsServerValidator('outer-global-dual.ibmcom-tls12.edgekey.net')).toStrictEqual(undefined);
    expect(dnsServerValidator('2001:0db8:85a3:0000:8a2e:0370:7334:1234')).toStrictEqual(undefined);
    expect(dnsServerValidator('2001:0db8:85a3::8a2e:0370:7334')).toStrictEqual(undefined);
  });

  test('validates the DNS server and return  an error message if input server is invalid', () => {
    expect(dnsServerValidator('example')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ]);
    expect(dnsServerValidator('1.1.1')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ]);
    expect(dnsServerValidator('c400:178c')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ]);
    expect(dnsServerValidator('2001:0db8:85a3:0000 :8a2e:0370:7334:1234')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ]);
    expect(dnsServerValidator('2001:0db8::85a3::8a2e:0370:7334')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ]);
    expect(dnsServerValidator('2001:0db8:85a3:0000:0000:8a2e:0370:7334:1234')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ]);
  });
});

describe('IPv4Validator', () => {
  test('validates the value field of an IPv4 record type and return undefined value if input address is valid', () => {
    expect(IPv4Validator('8.8.8.8')).toStrictEqual(undefined);
    expect(IPv4Validator('192.168.1.1')).toStrictEqual(undefined);
    expect(IPv4Validator('0.0.0.0')).toStrictEqual(undefined);
    expect(IPv4Validator('255.255.255.255')).toStrictEqual(undefined);
    expect(IPv4Validator('37.235.1.174')).toStrictEqual(undefined);
  });

  test('validates the value field of an IPv4 record type and return  an error message value if input address is invalid', () => {
    expect(IPv4Validator('256.256.256.256')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidIPv4Address')
      }
    ]);
    expect(IPv4Validator('192.168.1')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidIPv4Address')
      }
    ]);
    expect(IPv4Validator('192.168.01.1')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidIPv4Address')
      }
    ]);
  });
});

describe('IPv6Validator', () => {
  test('validates the value field of an IPv6 record type and return undefined value if input address is valid', () => {
    expect(IPv6Validator('2001:0db8:85a3:0000:8a2e:0370:7334:1234')).toStrictEqual(undefined);
  });

  test('validates the value field of an IPv6 record type and return  an error message value if input address is invalid', () => {
    expect(IPv6Validator('2600:1408:c400:178c::test')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidIPv6Address')
      }
    ]);
  });
});

describe('assertionValidator', () => {
  test('validates the DNS assertion and return undefined if assertion is valid', () =>
    expect(
      assertionValidator(
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'A',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        },
        '8.8.8.1',
        'ANY',
        'value'
      )
    ).toStrictEqual({
      id: 'qrV2-UbYk0BfCFEc',
      key: 'A',
      operator: 'CONTAINS',
      value: '8.8.8.8',
      error: {
        key: {
          invalid: false,
          message: ''
        },
        operator: {
          invalid: false,
          message: ''
        },
        value: {
          invalid: false,
          message: ''
        }
      }
    }));

  test('validates the DNS assertion and return updated assertion if only operator is filled', () =>
    expect(
      assertionValidator(
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: '',
          operator: 'CONTAINS',
          value: '',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        },
        'CONTAINS',
        'ANY',
        'operator'
      )
    ).toStrictEqual({
      id: 'qrV2-UbYk0BfCFEc',
      key: '',
      operator: 'CONTAINS',
      value: '',
      error: {
        key: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        },
        operator: {
          invalid: false,
          message: ''
        },
        value: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        }
      }
    }));

  test('validates the DNS assertion and return updated assertion if only query type is filled', () =>
    expect(
      assertionValidator(
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'A',
          operator: '',
          value: '',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        },
        'A',
        'ANY',
        'key'
      )
    ).toStrictEqual({
      id: 'qrV2-UbYk0BfCFEc',
      key: 'A',
      operator: '',
      value: '',
      error: {
        key: {
          invalid: false,
          message: ''
        },
        operator: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        },
        value: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        }
      }
    }));

  test('validates the DNS assertion and return updated assertion if only record resolution is filled', () =>
    expect(
      assertionValidator(
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: '',
          operator: '',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        },
        '8.8.8.8',
        'ANY',
        'value'
      )
    ).toStrictEqual({
      id: 'qrV2-UbYk0BfCFEc',
      key: '',
      operator: '',
      value: '8.8.8.8',
      error: {
        key: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        },
        operator: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        },
        value: {
          invalid: false,
          message: ''
        }
      }
    }));

  test('validates the DNS assertion and return updated assertion if record resolution is also invalid', () =>
    expect(
      assertionValidator(
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: '',
          operator: '',
          value: '8.8.8 .8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        },
        '8.8.8 .8',
        'ANY',
        'value'
      )
    ).toStrictEqual({
      id: 'qrV2-UbYk0BfCFEc',
      key: '',
      operator: '',
      value: '8.8.8 .8',
      error: {
        key: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        },
        operator: {
          invalid: true,
          message: t('in-services:validators.theValueMustNotBeBlank')
        },
        value: {
          invalid: true,
          message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidResolutionRecord')
        }
      }
    }));

  test('validates the DNS assertion and return updated assertion if query type and selected record type mismatches', () =>
    expect(
      assertionValidator(
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'AAAA',
          operator: 'CONTAINS',
          value: 'abc',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        },
        'AAAA',
        'A',
        'key'
      )
    ).toStrictEqual({
      id: 'qrV2-UbYk0BfCFEc',
      key: 'AAAA',
      operator: 'CONTAINS',
      value: 'abc',
      error: {
        key: {
          invalid: true,
          message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidRecordType')
        },
        operator: {
          invalid: false,
          message: ''
        },
        value: {
          invalid: false,
          message: ''
        }
      }
    }));
});

describe('responseTimeValidator', () => {
  test('validates the queryTime object and return undefined value of response time is valid', () => {
    expect(responseTimeValidator({ key: 'responseTime', operator: 'LESS_THAN', value: 120 })).toStrictEqual(undefined);
    expect(responseTimeValidator({ key: 'responseTime', operator: 'LESS_THAN', value: 50 })).toStrictEqual(undefined);
  });

  test('validates the queryTime object and return  an error message if response time is invalid', () => {
    expect(responseTimeValidator({ key: 'responseTime', operator: 'LESS_THAN', value: +'12@' })).toStrictEqual([
      {
        severity: 'error',
        message: getErrorMessage('Number', 'String')
      }
    ]);
    expect(responseTimeValidator({ key: 'responseTime', operator: 'LESS_THAN', value: +'12abc' })).toStrictEqual([
      {
        severity: 'error',
        message: getErrorMessage('Number', 'String')
      }
    ]);
  });
});

describe('noSpaceValidator', () => {
  test('validates the resolution record and return undefined value of resolution record is valid', () => {
    expect(noSpaceValidator('8.8.8.8')).toStrictEqual(undefined);
  });

  test('validates the resolution record and return  an error message if resolution record contain spaces', () => {
    expect(noSpaceValidator('8.8.8 .8')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidResolutionRecord')
      }
    ]);
  });
});

describe('checkQueryTypeAssertionMismatch', () => {
  test('validates all record typed and return  undefined if none of the record types and selected query type mismatches', () => {
    expect(
      checkQueryTypeAssertionMismatch('A', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'A',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'A',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('ANY', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'AAAA',
          operator: 'CONTAINS',
          value: 'abc',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'AAAA',
        operator: 'CONTAINS',
        value: 'abc',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('NS', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'CNAME',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'CNAME',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('CNAME', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'CNAME',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'CNAME',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('ALL', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'CNAME',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'CNAME',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('CNAME', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: '',
          operator: '',
          value: '',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: '',
        operator: '',
        value: '',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
  });
  test('validates all record typed and return  an error message if any of the record types and selected query type mismatches', () => {
    expect(
      checkQueryTypeAssertionMismatch('AAAA', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'A',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'A',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: true,
            message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidRecordType')
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('A', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'AAAA',
          operator: 'CONTAINS',
          value: 'abc',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'AAAA',
        operator: 'CONTAINS',
        value: 'abc',
        error: {
          key: {
            invalid: true,
            message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidRecordType')
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('CNAME', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'A',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'A',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: true,
            message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidRecordType')
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
    expect(
      checkQueryTypeAssertionMismatch('NS', [
        {
          id: 'qrV2-UbYk0BfCFEc',
          key: 'A',
          operator: 'CONTAINS',
          value: '8.8.8.8',
          error: {
            key: {
              invalid: false,
              message: ''
            },
            operator: {
              invalid: false,
              message: ''
            },
            value: {
              invalid: false,
              message: ''
            }
          }
        }
      ])
    ).toStrictEqual([
      {
        id: 'qrV2-UbYk0BfCFEc',
        key: 'A',
        operator: 'CONTAINS',
        value: '8.8.8.8',
        error: {
          key: {
            invalid: true,
            message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidRecordType')
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        }
      }
    ]);
  });
});
