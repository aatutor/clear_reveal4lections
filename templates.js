
"use strict";

function iop_present (root, list) {
	if ( !"debug" ) { list.forEach( (l) => console.log(l)) }
	$(list).appendTo(root);
	if ( "debug" ) { root.children().each( (i, l) => console.log(l)) }
}
function iop_slide(title, body) {
	var section = $('<section>');
	section.append( $('<h3>').append(title) );
	if (!(body instanceof Array)){
		body = [body];
	}
	body.forEach( (b) => section.append( b ) );
	return section.get(0);
}

/// === code ===
function iop_base_code(props) {
	var pre = $('<pre>');
	pre.append( $('<code>') );
	if (props.code) {
		pre.children().append($(`<script type="text/template">`).text(props.code));
	}
	for (const [k, v] of Object.entries(props)) {
		pre.children().attr(k, v);
	}
	if (!"debug") { console.log(pre); }
	return pre.get(0);
}

function iop_code(code, lines) {
	return iop_base_code({
		'code': code,
		'data-line-numbers': lines
	});
}

function iop_src_code(src, data, lines, after) {
	var prop = {
		'src': src,
		'src-data': data,
		'data-line-numbers': lines
	};
	if (after) {
		const afterList = {
			'n': 'no-after',
			'a': 'after'
		}
		prop[afterList[after]] = '';
	}
	return iop_base_code(prop);
}
/// --- /code ---

/// === markdown ===
function iop_base_md(tag, body, src) {
	var base = $(`<${tag} data-markdown="${src ?? ''}">`)
		.append($('<textarea data-template>') 
			.html( (body instanceof jQuery)? body.html() : body));
	if ( body instanceof jQuery ) {
		body.remove();
	}
	if ("debug") { console.log(base.children().get(0)); }
	return base.get(0);
}
function iop_slide_md(body) {
	return iop_base_md('section', body);
}
function iop_md(body) {
	return iop_base_md('div', body);
}
function iop_src_md(src) {
	return iop_base_md('section', '', src);
}
/// --- /markdown ---

function iop_hor(list, align) {
	var div = $('<div class="r-hstack">');
	$(list).each( (i, e) => {
		var d = $('<div>', {'class': 'h-mar'}).append(e);
		if (align == 'center') {
			if (i != 0) {
				d.addClass('h-mar-l1');
			}
			if (i != list.length - 1) {
				d.addClass('h-mar-r1');
			}
		}
		div.append(d);
	})
	return div.get(0);
}

/// === stack ===
// function iop_stack_base(list) {
// 	var div = $('<div class="r-stack">');

// }
// function iop_fr(list) {
// 	var div = $('<div class="fragment">');
// }
/// --- /stack ---


function iop_div(list) {
	var div = $('<div>');
	div.append( list );
	return div.get(0);
}

function iop_tag(tag, list) {
	var div = $('<' + tag + '>');
	div.append( list );
	return div.get(0);
}



// var iop = {};
// iop.present = (root, list) => {
// 	return $(list).appendTo(root);
// }
// iop.slide = (title, body) => {
// 	var section = $('<section>');
// 	section.append( $('<h3>').text(title) );
// 	if (!(body instanceof Array)){
// 		body = [body];
// 	}
// 	body.forEach( (b) => section.append( b ) );
// 	return section.get(0);
// }
// iop.base_code = (props) => {
// 	var pre = $('<pre>');
// 	pre.append( $('<code>') );
// 	if (props.code) {
// 		pre.children().append($(`<script type="text/template">`).text(props.code));
// 	}
// 	for (const [k, v] of Object.entries(props)) {
// 		pre.children().attr(k, v);
// 	}
// 	console.log(pre);
// 	return pre.get(0);
// }
// // <pre><code data-line-numbers=""><script type="text/template">
// iop.code = (code, lines) => {
// 	return iop.base_code({
// 		'code': code,
// 		'data-line-numbers': lines
// 	});
// 	// var pre = $('<pre>');
// 	// pre.append( $('<code>').attr('data-line-numbers', lines ?? '').text(code) );
// 	// return pre.get(0);
// }
// iop.src_code = (src, data, lines) => {
// 	return iop.base_code({
// 		'src': src,
// 		'src-data': data,
// 		'data-line-numbers': lines
// 	})
// }