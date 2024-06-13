
"use strict";

function tmp_section(title, body) {
	var section = $('<section>');
	section.append( $('<h3>').text(title) );
	if (body){
		section.append( body );
		console.log("body appended");
	}
	return section.get(0);
	// return $('<section>').append( $('<h3>').text(title) ).get(0);
}

// export default section;