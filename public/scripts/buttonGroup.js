var topTracksDiv = document.getElementById("topTracksDiv");
var topArtistsDiv = document.getElementById("topArtistsDiv");

(function () {
  //topArtistsDiv.style.display = "none";

  //topTracksSelect.removeAttribute("checked");
  //topArtistsSelect.setAttribute("checked", true);
})();

function setOption(type) {
  if (type == 'topTracks') {
    topTracksDiv.style.display = "block";
    topArtistsDiv.style.display = "none";
  }
  else if (type == 'topArtists') {
    topTracksDiv.style.display = "none";
    topArtistsDiv.style.display = "block";
  }
}