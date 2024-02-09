
function parseSource(src){
  var grep = src.indexOf('|');
  var name = src.slice(0, (grep != -1) ? grep : src.length);

  if (grep != -1) {
    var reg = src.slice(grep+1).split('-').map((val) => parseInt(val));
    reg[0]--;
  }

  return {
    filename: name,
    reg: reg
  };
}

/// TODO: only pre>code selector
var blocks = Array.from(document.getElementsByTagName("code"));
// console.log(blocks);

var list = blocks.filter((code) => ![null, ''].includes( code.getAttribute('src') ) );
// console.log(list);

list.forEach((code) => {
  var request = new XMLHttpRequest();
  var src = code.getAttribute('src');
  console.log(src);
  var parsed = parseSource(src);
  console.log(parsed.filename);
  
  request.open("GET", parsed.filename, false); // `false` makes the request synchronous
  request.send(null);
  
  if (request.status === 200) {
    var textCode = request.responseText;
    if (parsed.reg != null){
      console.log(parsed.reg);
      var codeLines = textCode.split('\r\n').slice(parsed.reg[0], parsed.reg[1]).join('\r\n');
      console.log(textCode);
      console.log(codeLines);
      textCode = codeLines;
    }
    console.log();
    code.innerHTML = '<script type="text/template">' + textCode + '</script>';
  } else {
    console.log(code);
  }
})

/// TODO: style="width: (maxlen + 4)ex;"
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