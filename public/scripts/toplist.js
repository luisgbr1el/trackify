function topList(title = String, info = String, arr = Array, divId = String, color = String) {
  let htmlText = "";
  let position = 1;
  
  htmlText += `
    <div class="top" style="color: ${color};">
        <center>
            <p class="topName">${title}</p>
            <p class="info">${info}</p>
        </center>
    </div>
  `;
  
  arr.forEach((item) => htmlText += `   
    <div class="topItem" style="background-image: linear-gradient(to right, #111a1a6e, ${color}); background-color: ${color};">
      <a class="track" href="${item.url}" target="_blank">               
        <span class="info">
          <p class="trackName">${position++}. ${item.name}</p>   
          ${item.artist ? "<br><p class='artistName'>" + item.artist + "</p>" : ""}
        </span>
      </a>
    </div>       
  `);
      
  document.getElementById(divId).innerHTML = htmlText;
}