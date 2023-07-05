/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

const browserTests: string[] = ['WebpageScript', 'WebpageAction', 'BrowserScript'];

const isBrowserTestType = (testType: string) => {
  return browserTests.includes(testType);
};

export default isBrowserTestType;
