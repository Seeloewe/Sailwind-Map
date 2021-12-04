
/**
 * (Immutable) Our own definition which should make it easier for us to manage just the data we need.
 * Make sure to always include conversion functions.
 */
class SailwindPoint {
  /**
   * A sailwind point.
   * @param {number} latitude - Equals to ArcGis `MapPoint.y`.
   * @param {number} longitude - Equals to ArcGis `MapPoint.x`.
   * @param {Date} [createdAt] (Optional) - Date and time of creation. May be interesting later to track travel times.
   */
  constructor(latitude, longitude, createdAt) {
    this._lat = latitude;
    this._long = longitude;
    this._createdAt = new Date(createdAt) ?? new Date();
  }

  get lat() {
    return this._lat;
  }

  get long() {
    return this._long;
  }

  get createdAt() {
    return new Date(this._createdAt);
  }

  //#region Conversion Functions
  //#region Conversion From
  /**
   * 
   * @param {Point} point - (https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html)
   */
  static fromArcGisPoint(point) {
    return new SailwindPoint(point.y, point.x);
  }
  static fromJSON(json) {
    if (typeof json === "string")
      json = JSON.parse(json);

    return new SailwindPoint(json.lat, json.long, json.createdAt);
  }
  //#endregion Conversion From

  //#region Conversion To

  /**
   * Convert to polyline node coord tuple.
   * @returns {Tuple} - Array with 2 elements.
   */
  toPolylinePathNode() {
    return [this.long, this.lat];
  }

  /**Converts to json stringifyable object. */
  toJSON() {
    return {
      lat: this.lat,
      long: this.long,
      createdAt: this.createdAt
    };
  }

  //#endregion Conversion To
  //#endregion Conversion Functions

}