module.exports = {
  /** Waits for the given amout of time in ms before the
   * promise is resolved with an empty value
   */
  sleep(n) {
    return new Promise(res => {
      setTimeout( ()=> res(), n);
    })
  }
}