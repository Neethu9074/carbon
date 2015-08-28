import BaseGroup from '../BaseGroup';


export default class UnknownGroup extends BaseGroup {

  constructor({parent, id}) {
    super({parent, id});
  }

  getColor() {
    return {r: 0.5, g: 0.5, b: 0.5};
  }
}
