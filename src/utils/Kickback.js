/**
 * @class Kickback. Async helper object.
 */
class Kickback {
  /**
   * @constructor
   * @param {Boolean} success If the action was a success.
   * @param {Boolean} error  If the action had an error.
   * @param {Object} payload The payload of the action.
   * @param {Object} e Error object if an error occurs.
   */
  constructor(success = false, error = false, payload = {}, e = null) {
    this.success = success;
    this.error = error;
    this.payload = payload;
    this.e = e;
    this.successOut = this.successOut.bind(this);
    this.errorOut = this.errorOut.bind(this);
  }

  /**
   * @method successOut Easy handler for making a kickback successful.
   * @param {Object} payload
   */
  successOut(payload) {
    this.success = true;
    this.error = false;
    this.payload = payload;
  }

  /**
   * @method errorOut Easy handler for making a kickback error out.
   * @param {Object} payload
   */
  errorOut(e) {
    this.success = false;
    this.error = true;
    this.e = e;
  }
}

module.exports = Kickback;
