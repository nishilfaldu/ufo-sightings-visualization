export class CentralDataStore {
  constructor(_attribute) {
    this.sharedData = [];
    this.subscribers = [];
    this.attribute = _attribute;

    d3.csv("data/national_health_data.csv")
      .then(data => {
        const processedData = processCountiesData(data);
        const filteredData = processedData.filter(d => d[_attribute] !== -1);

        this.sharedData = filteredData.map(cnty => cnty.cnty_fips);
        console.log(this.sharedData, "sharedData");
      });
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