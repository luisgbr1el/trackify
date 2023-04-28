function selector(divId = String, label = String, selectId = String, options = Array) {  
  // indentifying the div by id
  var div = document.getElementById(divId);

  // creating label to selector
  var labelText = document.createElement("label");
  labelText.className = "selectLabel";
  labelText.htmlFor = selectId;
  labelText.textContent = label;
  div.appendChild(labelText);

  // creating selector
  var select = document.createElement("select");
  select.id = selectId;
  select.className = "selector";
  div.appendChild(select);

  // creating options to selector
  options.forEach((option) => {
    var newOption = document.createElement("option");
    newOption.value = option.value;
    newOption.text = option.color;
    select.appendChild(newOption);
  })
}