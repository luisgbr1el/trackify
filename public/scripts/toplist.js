function topList(title = String, info = String, arr = Array, divId = String, gradientDirection = String, color1 = String, color2 = String, backgroundSize = String) {
  let htmlText = "";
  let position = 1;
  
  htmlText += `
    <div class="top">
        <center>
            <p class="topName">${title}</p>
            <p class="info">${info}</p>
        </center>
    </div>
  `;
  
  arr.forEach((item) => htmlText += `   
    <div class="topItem" style="background-image: linear-gradient(to ${gradientDirection}, ${color1}, ${color2}), url(${item.image}); background-size: ${backgroundSize}; background-color: ${color2}">
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