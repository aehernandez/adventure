// @flow
import Immutable from 'immutable';
import type { Node } from 'React';

export const Label = new Immutable.Record<*>({
  Blocking: 'Blocking'
})();


export class GameObject {
  position: [number, number];
  component: Node;
  labels: Immutable.Set<$Values<Label>> = new Immutable.Set();;
}
