import { observable, action } from 'mobx';

export class OverlayStore {
  constructor() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 's') { this.enableStats(); }
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 's') { this.disableStats(); }
    });
  }

  @action enableStats = () => this.showStats = true;
  @action disableStats = () => this.showStats = false;
  @observable showStats = false;
}

export default new OverlayStore();
