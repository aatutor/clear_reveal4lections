
function notEmpty(check) {
  return [null, ''].includes(check)
}

function parseAttribs(attrs){
  var res = {};

  if (notEmpty(attrs)) 
    return res;

  var grep = attrs.split('|');
  
  if (grep[0] != null) {
    res.ranges = grep[0].split(',').map((range) => {
      if (range != '') {
        var cut = range.split('-').map((val) => parseInt(val));
        // cut[0]--;
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
      rng.length != 0 ? (
        codeLines.slice(rng[0]-1, rng.length == 2 ? rng[1] : rng[0]).join(separator)
      ) : (
        '...'
      )
    );
  });
  for (var i=0; i != ranges.length; ++i) {
    console.log(ranges[i])
    if (ranges[i].length == 0) {
      var tabsBfr = (i == 0) ? ''
        : (codeLines[Math.max.apply(null, ranges[i-1])-1]
            .match(/^\t+/) 
            || ['']
          )[0];

      var tabsAft = (i == ranges.length-1) ? '' 
        : (codeLines[Math.min.apply(null, ranges[i+1])-1]
            .match(/^\t*/)
            || ['']
          )[0];
      // console.log(tabsBfr.length)
      // console.log(tabsAft.length)
      builder[i] = (
        tabsBfr.length > tabsAft.length
          ? tabsBfr
          : tabsAft
        ) + builder[i]
    }
  }
  if (ranges.length > 1) 
    console.log(builder);
  return builder.join( separator );
}

function fillFromFile(list, filler) {
  list.forEach( (item) => {
    var request = new XMLHttpRequest();
    request.open("GET", item.getAttribute('src'), false); // `false` makes the request synchronous
    request.send(null);
    
    var parsed = parseAttribs( item.getAttribute('src-data') );
    // console.log(parsed);
    
    if (request.status === 200) {
      var textCode = request.responseText;

      if (parsed.ranges != null){
        console.log(parsed.ranges);
        textCode = sliceLines(textCode, parsed.ranges);
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

var list = blocks.filter( (code) => !notEmpty( code.getAttribute('src') ) );
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