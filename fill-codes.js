
function parseAttribs(attrs){
  var grep = attrs.split('|');
  var res = {};
  
  if (grep[0] != null) {
    res.ranges = grep[0].split(',').map((range) => {
      if (range != '') {
        var cut = range.split('-').map((val) => parseInt(val));
        cut[0]--;
        return cut;
      }
      return [];
    });
  }
  
  return res;
}

function sliceLines(text, ranges) {
  const separator = '\r\n';

  var codeLines = text.split(separator);
  var builder = [];
  ranges.forEach((rng) => {
    builder.push(
      rng.length ? (
        codeLines
          .slice(rng[0], rng.length == 2 ? rng[1] : rng[0]+1)
          .join(separator)
      ) : (
        '...'
      )
    );
  });
  if (ranges.length > 1) 
    console.log(builder);
  return builder.join( separator );
}

function fillFromFile(list, filler) {
  list.forEach( (item) => {
    var parsed = parseAttribs( item.getAttribute('src-data') );
    console.log(parsed);
    
    var request = new XMLHttpRequest();
    request.open("GET", item.getAttribute('src'), false); // `false` makes the request synchronous
    request.send(null);
    
    if (request.status === 200) {
      var textCode = request.responseText;

      if (parsed.ranges != null){
        textCode = sliceLines(textCode, parsed.ranges);
        // console.log(parsed.ranges);
        // console.log(textCode);
      }
      item.innerHTML = filler.pref + textCode + filler.suff;
    } else {
      console.log(item);
    }
  });
}


/// ??? TODO: only pre>code selector
var blocks = Array.from(document.getElementsByTagName("code"));
// console.log(blocks);

var list = blocks.filter( (code) => ![null, ''].includes( code.getAttribute('src') ) );
// console.log(list);

fillFromFile(list, { pref: '<script type="text/template">', suff: '</script>' });

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