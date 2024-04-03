export class CentralDataStore {
  constructor(_data) {
    this.sharedData = _data || [];
    this.subscribers = [];
  }

  updateData(data) {
    this.sharedData = data;
    this.notifySubscribers();
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  getData() {
    return this.sharedData;
  }

  notifySubscribers() {
    this.subscribers.forEach(subscriber => {
      subscriber.update(this.sharedData);
    });
  }
}