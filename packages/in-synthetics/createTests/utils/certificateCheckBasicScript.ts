/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export const certificateCheckBasicScript = `const sslChecker = require('ssl-checker');
const assert = require('assert');

const getSslDetails = async(hostName, remainDays) => {
  const result = await sslChecker(hostName);

  assert.equal(result.valid, true, 'certificate of ibm should be valid');
  assert.equal(result.daysRemaining >= remainDays, true, \`certificate validated remain days is less than \${remainDays} days\`);
};

// this script will fail if the certificate remaining days less than \${remainDays} days by default
getSslDetails('<parameters>');`;
