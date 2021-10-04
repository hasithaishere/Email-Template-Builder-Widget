export default class Request {
  static sendPost(options) {
    const { data, url } = options;
    if (window.$) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url,
          type: "POST",
          contentType: "text/plain",
          //contentType: "application/json",
          data: JSON.stringify(data),
          dataType: "text",
          //dataType: "json",
          success: (response) => {
            console.log('JQ::Success::POST::', url);
            resolve(response);
          },
          error: (error) => {
            console.log('JQ::Failed', error);
            reject(error);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // listen for `load` event
        xhr.onload = (response) => {
          // print JSON response
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('XHR::Success::POST::', url);
            resolve(response);
          } else {
            console.log('XHR::Failed');
            reject(response);
          }
        };

        // open request
        xhr.open('POST', url);

        // set `Content-Type` header
        xhr.setRequestHeader('Content-Type', 'application/json');

        // send rquest with JSON payload
        xhr.send(JSON.stringify(data));
      })
    }
  }

  static xhrRequest(options){
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      
      xhr.open(options.method || "GET", options.url);
      if (options.headers) {
          Object.keys(options.headers).forEach(key => {
              xhr.setRequestHeader(key, options.headers[key]);
          });
      }
      
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
          } else {
              reject(xhr.statusText);
          }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(options.body);
    });
  }
}