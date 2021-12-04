
class SailwindTrip {
  /**
   * 
   * @param {SailwindPoint[]} path 
   * @param {boolean} ended 
   */
  constructor (path, ended) {
    /** @type {SailwindPoint[]} */
    this.path = path ?? [];
    
    /** @type {boolean} */
    this.ended = ended ?? false;
  }

  get startDate() {
    this.path[0]?.createdAt;
  }
  
  get endDate() {
    this.path[this.path.length - 1]?.createdAt;
  }

  /**
   * Push one or many sailwind points.
   * @param  {...SailwindPoint} sailwindPoints 
   */
  add(...sailwindPoints) {
    this.path.push(...sailwindPoints);
  }

  isAt(date) {
    return this.startDate <= date && date <= this.endDate
  }

  static fromJSON(json) {
    if (typeof json === "string")
      json = JSON.parse(json);

    return new SailwindTrip(json?.path.map(sailwindPoint => SailwindPoint.fromJSON(sailwindPoint), json.ended));
  }

  toJSON() {
    return {
      path: this.path,
      ended: this.ended,
    };
  }
}

/** @extends {SailwindTrip[]} */
class SailwindTripLog extends Array {
  constructor(sailwindTrips) {
    // When slicing etc it'll pass anumber instead.
    if (typeof sailwindTrips === "number") {
      super(sailwindTrips);
    } else {
      super();

      sailwindTrips = sailwindTrips ?? [];
      this.push(...(sailwindTrips.map(SailwindTrip.fromJSON)));
    }
  }

  getTripIndexByDate(date) {
    return this.findIndex(sailwindTrip => sailwindTrip.isAt(date));
  }

  getTripByDate(date) {
    return this[this.findIndex(date)];
  }
 
  get currentTrip() {
    return this[this.length - 1];
  }

  toJSON() {
    return [...this];
  }
}