
var blocks = Array.from(document.getElementsByTagName("code"));
// console.log(blocks);

var list = blocks.filter((code) => ![null, ''].includes( code.getAttribute('src') ) );
// console.log(list);

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


var lang = document.getElementsByClassName('reveal')[0].getAttribute('data-lang');

if (lang != null){
  blocks.forEach((code) => {
    if ([null, ''].includes( code.getAttribute('class') )){
      code.setAttribute('class', lang);
    }
    [ 'data-trim', 'data-noescape', 'contenteditable' ].forEach((attr) => {
      code.setAttribute(attr, '');
    })
  })
}