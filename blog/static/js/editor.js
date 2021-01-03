window.addEventListener("load", function(event) {	
	var md_check = document.getElementById("id_markdown");	
	if (md_check.checked) {	
		document.getElementById("id_content_iframe").contentWindow.$('#summernote').summernote('codeview.toggle');
	}

	md_check.addEventListener("click", function(event) {	
		document.getElementById("id_content_iframe").contentWindow.$('#summernote').summernote('codeview.toggle');
	});
}); 