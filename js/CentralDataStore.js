export class CentralDataStore {
  constructor(_attribute) {
    this.sharedData = [];
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
      console.log(subscriber, "subscriber");
      subscriber.update(this.sharedData);
    });
  }
}