/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
const getJSON = (path, options) => new Promise((resolve, reject) => {
  fetch(path, options)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        resolve(res.json());
      } else {
        res.json().then((decodedData) => {
          console.log('decodedData: ', decodedData);
          reject(decodedData.error);
        }).catch((err) => console.log('Hello?', err));
      }
    });
});
/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
  constructor(url) {
    this.url = url;
  }

  makeAPIRequest(path, options) {
    return getJSON(`${this.url}/${path}`, options);
  }

  post(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'POST',
    });
  }

  put(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'PUT',
    });
  }

  delete(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'DELETE',
    });
  }

  get(path, options) {
    return getJSON(`${this.url}/${path}`, {
      ...options,
      method: 'GET',
    });
  }
}
