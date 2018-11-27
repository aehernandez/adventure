// @flow
import Immutable from 'immutable';
import type { Node } from 'React';

export const Label = new Immutable.Record({
  Blocking: 'Blocking'
})();

export const Direction = new Immutable.Record({ 
  ALL: 'ALL', UP: 'UP', DOWN: 'DOWN', LEFT: 'LEFT', RIGHT: 'RIGHT' 
})();


export class GameObject {
  position: [number, number];
  component: Node;
  direction: $Values<Direction> = Direction.ALL;
  labels: Immutable.Set<$Values<Label>> = new Immutable.Set();;
}
