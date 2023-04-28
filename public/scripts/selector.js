function selector(selectId = String, options = Array) {
  var select = document.getElementById(selectId);
  var htmlText = '';

  options.forEach((option) => {
    htmlText += `
      <option id='${option}'>${option}</option>
    `;
  })

  select.innerHTML = htmlText;
}