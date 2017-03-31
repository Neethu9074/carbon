/* eslint-env mocha */
import { expect } from 'chai';

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

  const width = element => element.right - element.left;
  const height = element => element.bottom - element.top;
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

  // Tests basic tooltip alignments without any adjustments
  describe('basic-alignments', () => {
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

  // Test the internal shrinking behavior, if tooltip is out-of-bounds
  describe('shrinking-behavior', () => {
    it('should shrink width to bounds', () => {
      prepare(bounds.right * 2, 100, bounds.left, bounds.top, 200, 200, 'bottomLeft');
      const result = TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(result.right).to.equal(bounds.right);
      expect(result.left).to.equal(bounds.left);
      expect(result.top).to.equal(reference.bottom + TooltipCalculator.margin);
      expect(result.bottom).to.equal(null);
    });

    it('should shrink height to bounds', () => {
      prepare(100, bounds.bottom * 2, bounds.left, bounds.top, 200, 200, 'rightTop');
      const result = TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(result.right).to.equal(null);
      expect(result.left).to.equal(reference.right + TooltipCalculator.margin);
      expect(result.top).to.equal(bounds.top);
      expect(result.bottom).to.equal(bounds.bottom);
    });
  });

  // Tests the flipping behavior to avoid tooltips leaving the bounds
  describe('flipping-behavior', () => {
    it('should flip rightTop align to leftTop', () => {
      prepare(300, 300, bounds.right - 200, bounds.top, 200, 200, 'rightTop');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('leftTop');
    });

    it('should flip rightMiddle align to leftMiddle', () => {
      prepare(300, 300, bounds.right - 400, bounds.bottom - 400, 200, 200, 'rightMiddle');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('leftMiddle');
    });

    it('should flip rightBottom align to leftBottom', () => {
      prepare(300, 300, bounds.right - 200, bounds.bottom - 200, 200, 200, 'rightBottom');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('leftBottom');
    });

    it('should flip leftTop align to rightTop', () => {
      prepare(300, 300, bounds.left, bounds.top, 200, 200, 'leftTop');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('rightTop');
    });

    it('should flip leftMiddle align to rightMiddle', () => {
      prepare(300, 300, bounds.left, bounds.bottom - 400, 200, 200, 'leftMiddle');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('rightMiddle');
    });

    it('should flip leftBottom align to rightBottom', () => {
      prepare(300, 300, bounds.left, bounds.bottom - 200, 200, 200, 'leftBottom');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('rightBottom');
    });

    it('should flip topLeft align to bottomLeft', () => {
      prepare(300, 300, bounds.left, bounds.top, 200, 200, 'topLeft');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('bottomLeft');
    });

    it('should flip topMiddle align to bottomMiddle', () => {
      prepare(300, 300, bounds.left + 400, bounds.top, 200, 200, 'topMiddle');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('bottomMiddle');
    });

    it('should flip topRight align to bottomLeft', () => {
      prepare(300, 300, bounds.right - 200, bounds.top, 200, 200, 'topRight');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('bottomRight');
    });

    it('should flip bottomLeft align to topLeft', () => {
      prepare(300, 300, bounds.left, bounds.bottom - 200, 200, 200, 'bottomLeft');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('topLeft');
    });

    it('should flip bottomMiddle align to topMiddle', () => {
      prepare(300, 300, bounds.left + 400, bounds.bottom - 200, 200, 200, 'bottomMiddle');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('topMiddle');
    });

    it('should flip bottomRight align to topRight', () => {
      prepare(300, 300, bounds.right - 200, bounds.bottom - 200, 200, 200, 'bottomRight');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('topRight');
    });
  });

  // Tests the 'auto' behavior for tooltips
  describe('auto-alignment', () => {
    it('should auto-align topLeft', () => {
      prepare(300, 300, bounds.left, bounds.bottom - 200, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('topLeft');
    });

    it('should auto-align topMiddle', () => {
      prepare(300, 300, bounds.right / 2, bounds.bottom - 200, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('topMiddle');
    });

    it('should auto-align topRight', () => {
      prepare(300, 300, bounds.right - 200, bounds.bottom - 200, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('topRight');
    });

    it('should auto-align rightMiddle', () => {
      prepare(300, 300, bounds.left, bounds.bottom / 2, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('rightMiddle');
    });

    it('should auto-align leftMiddle', () => {
      prepare(300, 300, bounds.right - 200, bounds.bottom / 2, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('leftMiddle');
    });

    it('should auto-align bottomLeft', () => {
      prepare(300, 300, bounds.left, bounds.top, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('bottomLeft');
    });

    it('should auto-align bottomMiddle', () => {
      prepare(300, 300, bounds.right / 2, bounds.top, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('bottomMiddle');
    });

    it('should auto-align bottomRight', () => {
      prepare(300, 300, bounds.right - 200, bounds.top, 200, 200, 'auto');
      TooltipCalculator.calculate(bounds, tooltip, reference);
      expect(tooltip.align).to.equal('bottomRight');
    });
  });
});
