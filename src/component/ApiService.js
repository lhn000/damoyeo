function callApi(api, method, dto){
    const token = sessionStorage.getItem('token');
    let headers = {"Content-Type": "application/json"};
    if(token){
        headers = {...headers, 'Authorization': 'Bearer ' + token};
    }

    let options = {method, headers};
    if(method !== 'GET'){
        options = {...options, body: JSON.stringify(dto)}
    }
    return fetch(api, options);
  }

  export default callApi;