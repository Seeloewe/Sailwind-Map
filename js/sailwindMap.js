class SailwindMap {

  constructor(polylineGraphic, lineLayer, pointGraphic, pointLayer, sailwindTrips) {
    this._polylineGraphic = polylineGraphic.clone();
    this._pointGraphic = pointGraphic.clone();
    this._lineLayer = lineLayer;
    this._pointLayer = pointLayer;
    /** @type {SailwindTripLog} */
    this._sailwindTripLog = new SailwindTripLog(sailwindTrips);
  }

  get canSave() {
    return !!window.localStorage;
  }

  save() {
    if (!this.canSave)
      return;

    this._saveTimeoutId = setTimeout(() => {
      window.localStorage.setItem("sailwindTripLog", JSON.stringify(this._sailwindTripLog));
    }, 2000);
  }

  load() {
    if (!this.canSave)
      return;
    
    const tripLogFromStorage = JSON.parse(window.localStorage.getItem("sailwindTripLog"));

    console.debug("loaded", tripLogFromStorage);

    this._sailwindTripLog = new SailwindTripLog(tripLogFromStorage);

    for (let i = 0; i < this._sailwindTripLog.length; i++)
    {
      const sailwindTrip = this._sailwindTripLog[i];
      for (let j = 0; j < sailwindTrip.path.length; j++) {
        this._drawPointOnMap(sailwindTrip.path[j - 1], sailwindTrip.path[j], j > 0);
      }
    }
  }

  /**
   * Copy of point graphic.
   */
  get pointGraphic()  {
    return this._pointGraphic.clone();
  }

  /**
   * Copy of polyline graphic.
   */
  get polylineGraphic() {
    return this._polylineGraphic.clone();
  }

  /**
   * The second last sailwind point in the whole path.
   */
  get prevSailwindPoint() {
    const lastSailwindTrip = this._sailwindTripLog.currentTrip;
    return lastSailwindTrip.path[lastSailwindTrip.path.length - 2];
  }

  /** 
   * Add a new trip to the log.
   * Make sure the previous trip has ended.
   */
  addNewTrip() {
    if (!this.currentTripEnded)
      throw new Error("Last trip has not ended. Finish it first.")

    this._sailwindTripLog.push(new SailwindTrip());
  }

  endCurrentTrip() {
    if (this._sailwindTripLog.currentTrip)
      this._sailwindTripLog.currentTrip.ended = true;
  }

  get currentTripEnded() {
    return this._sailwindTripLog.currentTrip?.ended ?? true;
  }

  /**
   * Create a new point graphic from a sailwind point.
   * @param {SailwindPoint} sailwindPoint - 
   * @returns {PointGraphic} - See 
   */
  createPointGraphic(sailwindPoint) /*: PointGraphic */ {
    const pointGraphic = this.pointGraphic;
    pointGraphic.geometry.latitude = sailwindPoint.lat;
    pointGraphic.geometry.longitude = sailwindPoint.long;
    return pointGraphic;
  }

  /**
   * Draws given Sailwind point to the point layer.
   * This will also draw a line to the previous point.
   * @param {SailwindPoint} sailwindPoint - A single Sailwind point. 
   */
  drawPoint(sailwindPoint) {
    if (this.currentTripEnded)
      this.addNewTrip();
    
    this._sailwindTripLog.currentTrip.add(sailwindPoint);

    this._drawPointOnMap(this.prevSailwindPoint, sailwindPoint);
  }

  _drawPointOnMap(prevSailwindPoint, sailwindPoint) {
    const pointGraphic = this.createPointGraphic(sailwindPoint);
    this._pointLayer.add(pointGraphic);

    if (prevSailwindPoint)
      this.drawPolyline([prevSailwindPoint, sailwindPoint]);
  }

  /**
   * Creates a new polyline graphic from given range of sailwind points.
   * @param {SailwindPoint[]} sailwindPoints - A range of sailwind points.
   */
  createPolylineGraphic(sailwindPoints) {
    if (!sailwindPoints && sailwindPoints.length >= 2)
      throw new Error("To draw a polyline there must be more than 1 SailwindPoint");

    const polylineGraphic = this.polylineGraphic;
    polylineGraphic.geometry.paths = sailwindPoints.map(sp => sp.toPolylinePathNode());
    return polylineGraphic;
  }

  /**
   * Draws a new polyline graphic from given range of sailwind points.
   * @param {SailwindPoint[]} sailwindPoints - A range of sailwind points.
   */
  drawPolyline(sailwindPoints) {
    if (!sailwindPoints && sailwindPoints.length >= 2)
      throw new Error("Cannot draw a polyline from a single SailwindPoint");

    this._lineLayer.add(this.createPolylineGraphic(sailwindPoints));
  }

  /**
   * Add a range of Sailwind points to the point layer.
   * This will also draw lines between them.
   * @param {SailwindPoint[]} sailwindPoints - A list of Sailwind points.
   */
  drawPointRange(sailwindPoints) {
    for (let i = 0; i < sailwindPoints.length; i++) {
      const sailwindPoint = sailwindPoints[i];
      this.drawPoint(sailwindPoint)
    }
  }

  /**
   * Clears all map data.
   * NOTE: THIS IS A DESTRUCTIVE FUNCTION.
   */
  clear() {
    this._lineLayer.removeAll();
    this._pointLayer.removeAll();
    this._sailwindTripLog = new SailwindTripLog();
  }
}