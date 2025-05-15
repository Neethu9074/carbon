/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */



export default function initialiseSteps(initializationSteps: string[]): void {
  function nextStep(index: number): void {
    if (index >= initializationSteps.length) {
      // initialization process finished. yay!
      return;
    }

    // Using simple concatenation so that Webpack can properly analyze
    // this require statement for require.context creation.
    const mod = require('./steps/' + initializationSteps[index]);
    if (!mod || !mod.init) {
      nextStep(index + 1);
      return;
    }

    const result = mod.init();
    if (!result || !result.once) {
      nextStep(index + 1);
      return;
    }

    result.once(() => nextStep(index + 1));
  }

  nextStep(0);
}
