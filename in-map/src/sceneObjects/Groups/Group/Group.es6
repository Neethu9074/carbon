import {hexToRGBNormalized} from 'in-services/converters';
import {getColor} from 'in-sdk/zones';

import BaseGroup from '../BaseGroup';

export default class Group extends BaseGroup {

  constructor({parent, id}) {
    super({parent, id});
  }

  getColor() {
    return hexToRGBNormalized(getColor(this.id));
  }
}
