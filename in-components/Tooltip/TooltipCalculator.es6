const Bits = {
  LeftAlignment: 0b100000,
  RightAlignment: 0b010000,
  Right: 0b001000,
  Bottom: 0b000100,
  Left: 0b000010,
  Top: 0b000001
};

const Align = {
  leftBottom: Bits.Left | Bits.LeftAlignment,
  leftMiddle: Bits.Left,
  leftTop: Bits.Left | Bits.RightAlignment,
  topLeft: Bits.Top | Bits.LeftAlignment,
  topMiddle: Bits.Top,
  topRight: Bits.Top | Bits.RightAlignment,
  rightTop: Bits.Right | Bits.LeftAlignment,
  rightMiddle: Bits.Right,
  rightBottom: Bits.Right | Bits.RightAlignment,
  bottomRight: Bits.Bottom | Bits.LeftAlignment,
  bottomMiddle: Bits.Bottom,
  bottomLeft: Bits.Bottom | Bits.RightAlignment,
  auto: 0
};

let directionX = 0.0;
let directionY = 0.0;
let offsetX = 0.0;
let offsetY = 0.0;

const arrowSize = 0;

// Indexing
const la = 5;
const ra = 4;
const r = 3;
const b = 2;
const l = 1;
const t = 0;

// Bit utilities
const bit = (mask, digit) => (mask >> digit) & 1;
const is = (mask, digit) => bit(mask, digit) === 1;

// Dimension utilities
const width = (element) => (element.right - element.left);
const height = (element) => (element.bottom - element.top);
const centerX = (element) => element.left + width(element) / 2;
const centerY = (element) => element.top + height(element) / 2;


// TODO: implement offset
const popupOffsetX = 0;
const popupOffsetY = 0;

const TooltipCalculator = {

  // Calculates an updates position for the tooltip and its arrow by considering
  // a six digit bitmask.
  //
  // LA RA | R B L T
  // 6  5    4 3 2 1 (Bit number)
  // LA: Left alignment
  // RA: Right alignment
  // R: Right
  // B: Bottom
  // L: Left
  // T: Top
  calculate(bounds, tooltip, reference) {
    const data = {
      left: bounds.left,
      top: bounds.top
    };
    const mask = this.calculateMask(bounds, tooltip, reference);
    this.calculateInternally(data, mask, bounds, tooltip, reference);
    return data;
  },

  // Calculates the tooltip position (left, top) and the arrow alignment
  calculateInternally(data, mask, bounds, tooltip, reference) {
    this.updateDirection(mask, reference);
    this.updateOffset(mask, tooltip, reference);
    this.calculatePopupPosition(data, reference);
    this.calculateArrowPosition(data, mask, reference, tooltip);
  },

  // Calculates the bitmask for tooltip alignment
  calculateMask(bounds, tooltip) {
    let mask = Bits.Bottom;
    if (tooltip.align === 'undefined' || tooltip.align === 0) {
      // TODO: Auto-Alignment
    } else {
      mask = Align[tooltip.align];
    }
    return mask;
  },

  // Aligns the direction vector to the direction of the positioning. The
  // direction vector is half of the length of the reference element
  updateDirection(mask, reference) {
    directionX = (bit(mask, r) ^ -bit(mask, l)) * width(reference) / 2;
    directionY = (bit(mask, b) ^ -bit(mask, t)) * height(reference) / 2;
  },

  updateOffset(mask, tooltip, reference) {
    offsetX = -bit(mask, l) * (width(tooltip) + arrowSize);
    offsetY = -bit(mask, t) * (height(tooltip) + arrowSize);
    offsetX += bit(mask, r) * arrowSize;
    offsetY += bit(mask, b) * arrowSize;
    if (is(mask, la)) {
      offsetX -= bit(mask, t) * width(reference) / 2;
      offsetY -= bit(mask, r) * height(reference) / 2;
      offsetX -= bit(mask, b) * (width(tooltip) - width(reference) / 2);
      offsetY -= bit(mask, l) * (height(tooltip) - height(reference) / 2);
    } else if (is(mask, ra)) {
      offsetX -= bit(mask, b) * width(reference) / 2;
      offsetY -= bit(mask, l) * height(reference) / 2;
      offsetX -= bit(mask, t) * (width(tooltip) - width(reference) / 2);
      offsetY -= bit(mask, r) * (height(tooltip) - height(reference) / 2);
    } else {
      offsetX -= (bit(mask, t) | bit(mask, b)) * (width(tooltip) / 2);
      offsetY -= (bit(mask, l) | bit(mask, r)) * (height(tooltip) / 2);
    }
  },

  calculatePopupPosition(data, reference) {
    data.left = centerX(reference) + directionX + offsetX + popupOffsetX;
    data.top = centerY(reference) + directionY + offsetY + popupOffsetY;
  },

  calculateArrowPosition(data, mask, reference, tooltip) {
    let moveX = width(tooltip) / 2;
    let moveY = height(tooltip) / 2;
    const deltaX = moveX - width(reference) / 2;
    const deltaY = moveY - height(reference) / 2;

    // Position always centered to the reference
    if (is(mask, la)) {
      moveX -= bit(mask, t) * deltaX;
      moveX += bit(mask, b) * deltaX;
      moveY += bit(mask, l) * deltaY;
      moveY -= bit(mask, r) * deltaY;
    } else if (is(mask, ra)) {
      moveX += bit(mask, t) * deltaX;
      moveX -= bit(mask, b) * deltaX;
      moveY -= bit(mask, l) * deltaY;
      moveY += bit(mask, r) * deltaY;
    }

    // Consider offset
    moveX -= (bit(mask, t) | bit(mask, b)) * popupOffsetX;
    moveY -= (bit(mask, l) | bit(mask, r)) * popupOffsetY;

    // Consider arrow size
    data.arrowLeft = (bit(mask, t) | bit(mask, b)) * (moveX - arrowSize) / 2;
    data.arrowTop = (bit(mask, l) | bit(mask, r)) * (moveY - arrowSize) / 2;

    // "vertical" alignment to position arrow to its reference
    data.arrowLeft += bit(mask, l) * width(tooltip);
    data.arrowLeft -= bit(mask, r) * arrowSize;
    data.arrowTop += bit(mask, t) * height(tooltip);
    data.arrowTop -= bit(mask, b) * arrowSize;
  }
};

export default TooltipCalculator;
