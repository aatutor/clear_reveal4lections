
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


    // res.ranges = grep[1].split('-').map((val) => parseInt(val));
    // res.ranges[0]--;
  }
  // if (grep[2] != null) {
  //   res.cut = grep[2].split(',').map((val) => {
  //     return val.split('-').map((val) => parseInt(val));
  //   });
  // }

  return res;
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
  console.log(parsed);
  
  request.open("GET", parsed.filename, false); // `false` makes the request synchronous
  request.send(null);
  
  if (request.status === 200) {
    var textCode = request.responseText;

    if (parsed.ranges != null){
      // console.log(parsed.ranges);
      var codeLines = textCode.split('\r\n');
      textCode = [];
      parsed.ranges.forEach((rng) => {
        textCode.push(codeLines.slice(rng[0], rng.length == 2 ? rng[1] : rng[0]+1).join('\r\n')+'\r\n');
      });//.slice(parsed.ranges[0], parsed.ranges[1]);
      console.log(textCode);
      // console.log(codeLines);
      /// TODO: fix for absolute index
      // textCode = codeLines.join('\r\n');
      textCode = textCode.join('...\r\n');
      // console.log(textCode);
    }
    // console.log();
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