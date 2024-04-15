
function isEmpty(check) {
  return [null, ''].includes(check)
}

function parseAttribs(attrs){
  var res = {};

  if (isEmpty(attrs)) 
    return res;

  var grep = attrs.split('|');
  var offset = parseInt(grep[1]) || 0;
  
  if (grep[0] != null) {
    res.ranges = grep[0].split(',').map((range) => {
      if (range != '') {
        var cut = range.split('-').map((val) => (parseInt(val) + offset) );
        return cut;
      }
      return [];
    });
  }
  
  return res;
}

// function countTabs()

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
	const countTabs = (ind, lvl) => {
		return (ind == (lvl=='max' ? 0 : ranges.length-1)) ? ''
      : (
				codeLines[Math[lvl].apply(null, ranges[ind+(lvl=='max' ? -1:1)])-1]
					.match(/^\t*/)
				|| ['']
			)[0];
	}
  for (var i=0; i != ranges.length; ++i) {
    // console.log(ranges[i])
    if (ranges[i].length == 0) {
      // var tabsBfr = (i == 0) ? ''
      // : (codeLines[Math['max'].apply(null, ranges[i-1])-1]
      //       .match(/^\t*/)
      //       || ['']
      //     )[0];

      // var tabsAft = (i == ranges.length-1) ? '' 
      //   : (codeLines[Math['min'].apply(null, ranges[i+1])-1]
      //       .match(/^\t*/)
      //       || ['']
      //     )[0];
			var tabsBfr = countTabs(i, 'max');
			var tabsAft = countTabs(i, 'min');
      // console.log(tabsBfr.length)
      // console.log(tabsAft.length)
      builder[i] = (
        tabsBfr.length > tabsAft.length
          ? tabsBfr
          : tabsAft
        ) + builder[i]
    }
  }
  // if (ranges.length > 1) console.log(builder);
  return builder.join( separator );
}

function fillFromFile(list, filler) {
  list.forEach( (item) => {
    var request = new XMLHttpRequest();
    request.open("GET", item.getAttribute('src'), false); // `false` makes the request synchronous
    request.send(null);
    // var fileName = request.responseURL.split('/').pop();

    // console.log(item.parentElement)
    
    var parsed = parseAttribs( item.getAttribute('src-data') );
    console.log(parsed);
    
    if (request.status === 200) {
      var textCode = request.responseText;

      // if (parsed.ranges != null){
			try{
        console.log(parsed.ranges);
        console.log(textCode);
        textCode = sliceLines(textCode, parsed.ranges);
        console.log(textCode);
      }
			catch(e){
				console.log(e);
				console.log(item);
			}
			
      item.innerHTML = filler.pref + textCode + filler.suff;
    } else {
      console.log(item);
    }
  });
}

function filterAttr(arr) {
  return arr.filter( (elem) => !isEmpty( elem.getAttribute('src') ) );
}

function readProps() {
  var request = new XMLHttpRequest();
  request.open("GET", 'props.json', false); // `false` makes the request synchronous
  request.send(null);
  
  return JSON.parse(request.responseText);
}

function tagPrepend(tag, text) {
  tag.innerHTML = text + tag.innerHTML;
}


var props = readProps();

/// ??? TODO: only pre>code selector
var codes = Array.from(document.getElementsByTagName("code"));
// console.log(codes);

fillFromFile(
  filterAttr(codes), 
  { 
    pref: '<script type="text/template">', 
    suff: '</script>'
  }
);

if (props.lang){
  codes.forEach((code) => {
    if (isEmpty( code.getAttribute('class') )){
      code.setAttribute('class', props.lang);
    }
    [ 'data-trim', 'data-noescape', 'contenteditable' ].forEach((attr) => {
      code.setAttribute(attr, '');
    })
  })
}

if (props.titlePref) {
  tagPrepend( 
    document.getElementsByTagName('title')[0], 
    props.titlePref + ' | '
  )
}

if (props.namePref) {
  tagPrepend(
    ( document.getElementsByName('autor')[0] 
      || document.getElementsByTagName('section')[0].getElementsByTagName('small')[0]),
    props.namePref + '<br>'
  )
}

