import { default as axios } from "axios";
require("dotenv").load();

export async function sendViewOpenRequest(url, view, trigger = "") {
  return await axios({
    method: "post",
    url: url,
    headers: {
      "Content-type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env.BOT_TOKEN}`
    },
    data: {
      trigger_id: trigger,
      view
    }
  });
}

export async function sendViewUpdateRequest(url, view, trigger = "", view_id) {
  return await axios({
    method: "post",
    url: url,
    headers: {
      "Content-type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env.BOT_TOKEN}`
    },
    data: {
      view_id,
      trigger_id: trigger,
      view
    }
  });
}


export async function sendViewPublishRequest(url, view, user_id) {
  return await axios({
    method: "post",
    url: url,
    headers: {
      "Content-type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env.BOT_TOKEN}`
    },
    data: {
      user_id,
      view
    }
  });
}


// Add a request interceptor
axios.interceptors.request.use(
  req => {
    //console.log(req);
    return req;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);



// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    //console.log(response);
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);
