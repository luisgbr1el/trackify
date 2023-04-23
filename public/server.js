function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

  let params = getHashParams();

let access_token = params.access_token,
  client_secret = params.client_secret,
  dev_token = params.dev_token,
  client = params.client,
  error = params.error;

const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const TOPTRACKS = "https://api.spotify.com/v1/me/top/tracks";
const TOPARTISTS = "https://api.spotify.com/v1/me/top/artists";
const USER = "https://api.spotify.com/v1/me";

function onPageLoad() {
  if (window.location.search.length > 0) {
    handleRedirect();
  }
  else {
    document.getElementById("topSection").style.display = 'block';
    if (access_token == null) {
      document.getElementById("tokenSection").style.display = 'block';
      document.getElementById("resume").style.display = "none";
      document.getElementById("user").style.display = "none";
      document.getElementById("dropdown").style.display = "none";
    }
    else {
      user();
      topTracks();
      topArtists();

      document.getElementById("topSection").style.display = 'block';
      document.getElementById("loadingSection").style.display = "none";
    }
  }
}

function logout() {
  window.location.href = '/';
}

function handleRedirect() {
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState("", "", redirect_uri);
}

function getCode() {
  let code = null;
  const queryString = window.location.search;
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    code = urlParams.get('code')
  }
  return code;
}

function requestAuthorization() {
  let url = AUTHORIZE;
  url += "?client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url += "&scope=user-read-email user-top-read";
  window.location.href = url;
}

function fetchAccessToken(code) {
  let body = "grant_type=authorization_code";
  body += "&code=" + code;
  body += "&redirect_uri=" + encodeURI(redirect_uri);
  body += "&client_id=" + client_id;
  body += "&client_secret=" + client_secret;
  callAuthorizationApi(body);
}

function refreshAccessToken() {
  let body = "grant_type=refresh_token";
  body += "&refresh_token=" + refresh_token;
  body += "&client_id=" + client_id;
  callAuthorizationApi(body);
}

function callAuthorizationApi(body) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", TOKEN, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
  xhr.send(body);
  xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);

    var data = JSON.parse(this.responseText);
    if (data.access_token != undefined) {
      access_token = data.access_token;
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
    }
    onPageLoad();
  }
  else {
    console.log(this.responseText);
    window.location.href = "/";
  }
}

function callApi(method, url, body, callback) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.send(body);
  xhr.onload = callback;
}

function handleTopTracksResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    let tracks = [];

    data.items.forEach((item, index) => {
      tracks.push({
        name: item.name,
        artist: item.artists[0].name,
        url: item.external_urls.spotify
      })
    });

    topList("top tracks", "(last month)", tracks, "topTracksList", "#2F4F4F");
  }
  else if (this.status == 401) {
    //refreshAccessToken()
    window.location.href = '/';
  }
  else {
    console.log(this);
    alert(this.responseText);
  }
}

function handleTopArtistsResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);
    let artists = [];

    data.items.forEach((item, index) => {
      artists.push({
        name: item.name,
        url: item.external_urls.spotify
      })
    });

    topList("top artists", "(last month)", artists, "topArtistsList", "#2F4F4F");
  }
  else if (this.status == 401) {
    //refreshAccessToken()
    window.location.href = "/";
  }
  else {
    console.log(this);
    alert(this.responseText);
  }
}

function handleUserResponse() {
  if (this.status == 200) {
    var data = JSON.parse(this.responseText);

    userDiv = `        
      <a>
        ${data.display_name}
      </a>
    `;

    document.getElementById("user").innerHTML = userDiv;

    dropdownDiv = `
        <a type="button" class="headerButton" href="${data.external_urls.spotify}" target="_blank">Profile</a>
        <hr>
        <input type="button" class="headerButton" onclick="logout()" value="Logout"> 
        `;

    document.getElementById("dropdown").innerHTML = dropdownDiv;
  }
  else if (this.status == 401) {
    //refreshAccessToken()
    window.location.href = '/';
  }
  else {
    console.log(this);
    alert(this.responseText);
  }
}

function topTracks() {
  callApi("GET", TOPTRACKS + "?limit=5&offset=0&time_range=short_term", null, handleTopTracksResponse);
}

function topArtists() {
  callApi("GET", TOPARTISTS + "?limit=5&offset=0&time_range=short_term", null, handleTopArtistsResponse);
}

function user() {
  callApi("GET", USER, null, handleUserResponse);
}