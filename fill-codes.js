
function parseSource(src){
  var grep = src.split('|');
  var res = {};
  res.filename = grep[0];

  if (grep[1] != null) {
    res.ranges = grep[1].split(',').map((pair) => {
      var cut = pair.split('-').map((val) => parseInt(val));
      cut[0]--;
      return cut;
    });

  }

  return res;
}
function sliceLines(text, ranges) {
  var codeLines = text.split('\r\n');
  var builder = [];
  ranges.forEach((rng) => {
    builder.push(codeLines.slice(rng[0], rng.length == 2 ? rng[1] : rng[0]+1).join('\r\n')+'\r\n');
  });
  return builder.join('...\r\n');
}
var snippetFiller = (code) => {
  var request = new XMLHttpRequest();
  var src = code.getAttribute('src');
  // console.log(src);
  var parsed = parseSource(src);
  // console.log(parsed);
  
  request.open("GET", parsed.filename, false); // `false` makes the request synchronous
  request.send(null);
  
  if (request.status === 200) {
    var textCode = request.responseText;

    if (parsed.ranges != null){
      textCode = sliceLines(textCode, parsed.ranges);
      // console.log(parsed.ranges);
      console.log(textCode);
    }
    code.innerHTML = '<script type="text/template">' + textCode + '</script>';
  } else {
    console.log(code);
  }
};

/// TODO: only pre>code selector
var blocks = Array.from(document.getElementsByTagName("code"));
// console.log(blocks);

var list = blocks.filter((code) => ![null, ''].includes( code.getAttribute('src') ) );
// console.log(list);

list.forEach(snippetFiller);

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