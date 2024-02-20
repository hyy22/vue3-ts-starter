class EventBus {
  private _callbacks: { [key: string]: FunctionType[] } = {};
  // 监听事件
  public on(type: string, cb: FunctionType) {
    this._callbacks[type]
      ? this._callbacks[type].push(cb)
      : (this._callbacks[type] = [cb]);
  }
  // 触发事件
  public emit(type: string, ...args: any[]) {
    if (this._callbacks[type] && this._callbacks[type].length) {
      this._callbacks[type].forEach(cb => cb(...args));
    }
  }
  // 移除监听
  public off(type: string, cb?: FunctionType) {
    if (this._callbacks[type] && this._callbacks[type].length) {
      if (cb) {
        const index = this._callbacks[type].findIndex(v => v === cb);
        if (index > -1) {
          this._callbacks[type].splice(index, 1);
          if (this._callbacks[type].length <= 0) delete this._callbacks[type];
        }
      } else {
        delete this._callbacks[type];
      }
    }
  }
  // 只监听一次
  public once(type: string, cb: FunctionType) {
    const callback = (...args: any[]) => {
      cb(...args);
      this.off(type, callback);
    };
    this.on(type, callback);
  }
}

export default new EventBus();
