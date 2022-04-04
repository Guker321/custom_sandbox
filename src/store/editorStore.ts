import {  action, makeObservable, observable } from 'mobx';

class editorStore {
  codeData: string = 'const a = 1';

  constructor() {
    makeObservable(this, {
      codeData: observable,
      setCode: action.bound,
    });
  }

  setCode(code: string) {
    this.codeData = code;
  }

}

export default new editorStore();