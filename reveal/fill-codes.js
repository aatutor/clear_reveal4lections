
var blocks = document.getElementsByTagName("code");
// console.log(blocks);

var list = Array.from(blocks).filter((code) => ![null, ''].includes( code.getAttribute('src') ) );
console.log(list);
list.forEach((code) => {
  var request = new XMLHttpRequest();
  request.open("GET", code.getAttribute('src'), false); // `false` makes the request synchronous
  request.send(null);
  
  if (request.status === 200) {
    // console.log(request.responseText);
    code.innerHTML = '<script type="text/template">' + request.responseText + '</script>';
  }
  else {
    console.log(code);
  }
})