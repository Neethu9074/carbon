/* eslint-env mocha */
import {expect} from 'chai';

import TooltipCalculator from './TooltipCalculator';

describe('in-components/TooltipCalculator', () => {

  const bounds = {
      left: 0,
      top: 0,
      right: 2000,
      bottom: 2000
  };

  const tooltip = {};

  const reference = {};

  const width = (element) => (element.right - element.left);
  const height = (element) => (element.bottom - element.top);
  const prepare = (tooltipW, tooltipH, refX, refY, refW, refH, align) => {
    tooltip.left = 0;
    tooltip.top = 0;
    tooltip.right = tooltipW;
    tooltip.bottom = tooltipH;
    reference.left = refX;
    reference.right = refX + refW;
    reference.top = refY;
    reference.bottom = refY + refH;
    tooltip.align = align;
  };

  it('should align left bottom', () => {
    prepare(100, bounds.bottom / 2, bounds.right - 200, bounds.bottom - 200, 200, 200, 'leftBottom');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);

    expect(result.left).to.equal(null);
    expect(result.top).to.equal(null);
    expect(result.right).to.equal(reference.left - TooltipCalculator.margin);
    expect(result.bottom).to.equal(reference.bottom);
  });

  it('should align left middle', () => {
    prepare(100, 50, bounds.right - 200, bounds.bottom - 200, 200, 200, 'leftMiddle');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(reference.left - TooltipCalculator.margin);
    expect(result.top).to.equal(reference.top + (height(reference) / 2 - height(tooltip) / 2));
    expect(result.left).to.equal(null);
    expect(result.bottom).to.equal(null);
  });

  it('should align left top', () => {
    prepare(100, bounds.bottom / 2, bounds.right - 200, bounds.top, 200, 200, 'leftTop');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(reference.left - TooltipCalculator.margin);
    expect(result.top).to.equal(reference.top);
    expect(result.left).to.equal(null);
    expect(result.bottom).to.equal(null);
  });

  it('should align top left', () => {
    prepare(bounds.right / 2, 100, bounds.left, bounds.bottom - 200, 200, 200, 'topLeft');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(null);
    expect(result.top).to.equal(null);
    expect(result.left).to.equal(reference.left);
    expect(result.bottom).to.equal(reference.top - TooltipCalculator.margin);
  });

  it('should align top middle', () => {
    prepare(100, 100, bounds.left, bounds.bottom - 200, 200, 200, 'topMiddle');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(null);
    expect(result.top).to.equal(null);
    expect(result.left).to.equal(reference.left + width(reference) / 2 - width(tooltip) / 2);
    expect(result.bottom).to.equal(reference.top - TooltipCalculator.margin);
  });

  it('should align top right', () => {
    prepare(bounds.right / 2, 100, bounds.right - 200, bounds.bottom - 200, 200, 200, 'topRight');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(reference.right);
    expect(result.top).to.equal(null);
    expect(result.left).to.equal(null);
    expect(result.bottom).to.equal(reference.top - TooltipCalculator.margin);
  });

  it('should align right top', () => {
    prepare(100, bounds.bottom / 2, bounds.left, bounds.top, 200, 200, 'rightTop');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(null);
    expect(result.top).to.equal(reference.top);
    expect(result.left).to.equal(reference.right + TooltipCalculator.margin);
    expect(result.bottom).to.equal(null);
  });

  it('should align right middle', () => {
    prepare(100, 100, bounds.left, bounds.top, 200, 200, 'rightMiddle');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(null);
    expect(result.top).to.equal(reference.top + height(reference) / 2 - height(tooltip) / 2);
    expect(result.left).to.equal(reference.right + TooltipCalculator.margin);
    expect(result.bottom).to.equal(null);
  });

  it('should align right bottom', () => {
    prepare(100, bounds.bottom / 2, bounds.left, bounds.bottom - 200, 200, 200, 'rightBottom');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(null);
    expect(result.top).to.equal(null);
    expect(result.left).to.equal(reference.right + TooltipCalculator.margin);
    expect(result.bottom).to.equal(reference.bottom);
  });

  it('should align bottom right', () => {
    prepare(bounds.right / 2, 100, bounds.right - 200, bounds.top, 200, 200, 'bottomRight');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(reference.right);
    expect(result.top).to.equal(reference.bottom + TooltipCalculator.margin);
    expect(result.left).to.equal(null);
    expect(result.bottom).to.equal(null);
  });

  it('should align bottom middle', () => {
     prepare(100, 100, bounds.left, bounds.top, 200, 200, 'bottomMiddle');

     const result = TooltipCalculator.calculate(bounds, tooltip, reference);
     expect(result.right).to.equal(null);
     expect(result.left).to.equal(reference.left + width(reference) / 2 - width(tooltip) / 2);
     expect(result.top).to.equal(reference.bottom + TooltipCalculator.margin);
     expect(result.bottom).to.equal(null);
  });

  it('should align bottom left', () => {
    prepare(bounds.right / 2, 100, bounds.left, bounds.top, 200, 200, 'bottomLeft');

    const result = TooltipCalculator.calculate(bounds, tooltip, reference);
    expect(result.right).to.equal(null);
    expect(result.left).to.equal(reference.left);
    expect(result.top).to.equal(reference.bottom + TooltipCalculator.margin);
    expect(result.bottom).to.equal(null);
  });
});
