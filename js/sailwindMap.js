class SailwindMap {

  constructor(polylineGraphic, lineLayer, pointGraphic, pointLayer) {
    this._polylineGraphic = polylineGraphic.clone();
    this._pointGraphic = pointGraphic.clone();
    this._lineLayer = lineLayer;
    this._pointLayer = pointLayer;
    this._fullSailwindPath = [];
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
    return this._fullSailwindPath[this._fullSailwindPath.length - 2];
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
    this._fullSailwindPath.push(sailwindPoint);
    const pointGraphic = this.createPointGraphic(sailwindPoint);
    this._pointLayer.add(pointGraphic);
    console.debug("Drawn point graphic", pointGraphic);
    if (this.prevSailwindPoint)
      this.drawPolyline([this.prevSailwindPoint, sailwindPoint]);
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
    this._fullSailwindPath = [];
  }
}