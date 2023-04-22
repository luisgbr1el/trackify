
  var today = new Date();
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
  // client_id = localStorage.getItem("client_id");
  // client_secret = localStorage.getItem("client_secret");

  if (window.location.search.length > 0) {
    handleRedirect();
  }
  else {
    // access_token = localStorage.getItem("access_token");

    document.getElementById("topSection").style.display = 'block';
    if (access_token == null) {
      document.getElementById("tokenSection").style.display = 'block';
      document.getElementById("resume").style.display = "none";
      document.getElementById("user").style.display = "none";
      document.getElementById("dropdown").style.display = "none";
    }
    else {
      document.getElementById("topSection").style.display = 'block';
      document.getElementById("loadingSection").style.display = "none";

      user();
      topTracks();
      topArtists();
    }
  }
}

function logout() {
  window.location.href = '/';
}

function handleRedirect() {
  let code = getCode();
  fetchAccessToken(code);
  window.history.pushState("", "", redirect_uri); // remove param from url
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
  url += "&scope=user-read-private user-read-email user-top-read";
  window.location.href = url; // Show Spotify's authorization screen
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
  //refresh_token = localStorage.getItem("refresh_token");
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
      // localStorage.setItem("access_token", access_token);
    }
    if (data.refresh_token != undefined) {
      refresh_token = data.refresh_token;
      // localStorage.setItem("refresh_token", refresh_token);
    }
    onPageLoad();
  }
  else {
    console.log(this.responseText);
    //window.location.reload();
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
    let htmlText = "";
    let position = 1;

    data.items.forEach((item, index) => {
      tracks.push({
        name: item.name,
        artist: item.artists[0].name,
        image: item.album.images[0].url,
        url: item.external_urls.spotify
      })
    });

    htmlText += `
        <div class="top">
            <center>
                <p class="topName">top tracks</p>
                <p class="artistName">(last 4 weeks)</p>
            </center>
        </div>
        `;
    tracks.forEach((track) => htmlText +=
      `
        
        <div class="topTrack" style="background-image: linear-gradient(to right, #2f4f4f6e, #2F4F4F), url(${track.image});">
            <a class="track" href="${track.url}" target="_blank">
                
                <span class="info">
                    <p class="trackName">${position++}. ${track.name}</p><br>   
                    <p class="artistName">${track.artist}</p>
                </span>
            </a>
        </div>       
        `);

    document.getElementById("topTracksList").innerHTML = htmlText;
  }
  else if (this.status == 401) {
    refreshAccessToken()
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
    let htmlText = "";
    let position = 1;

    data.items.forEach((item, index) => {
      artists.push({
        name: item.name,
        image: item.images[0].url,
        url: item.external_urls.spotify
      })
    });

    htmlText += `
        <div class="top">
            <center>
                <p class="topName">top artists</p>
                <p class="artistName">(last 4 weeks)</p>
            </center>
        </div>
        `;
    artists.forEach((artist) => htmlText +=
      `
        
        <div class="topArtist" style="background-image: linear-gradient(to right, #2f4f4f6e, #2F4F4F), url(${artist.image});">
            <a class="track" href="${artist.url}" target="_blank">
                <p class="trackName">${artist.name}</p>   
            </a>
        </div>
        `);

    document.getElementById("topArtistsList").innerHTML = htmlText;
  }
  else if (this.status == 401) {
    refreshAccessToken()
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
        <img id="userPfp" src="${data.images[0].url}">
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
    refreshAccessToken()
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