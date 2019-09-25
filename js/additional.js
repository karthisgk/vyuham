(function ($) {
	const downloads = ['brouchure-01.jpg'];
    downloads.forEach(function(itemRef,ind) {
        const url = window.baseURL + "img/downloads/" + itemRef;
        const element = '\
        <div>\
          <a data-href="downloads-'+ind+'" href="'+url+'">'+itemRef+'</a>\
        </div>';
        $('.downloads').append(element);
        const fn = (e) => {
            e.preventDefault();
            var link = document.createElement("a");
            var targetFile = e.target.href;
            link.target = '_blank';
            link.download = targetFile;
            link.href = targetFile;
            link.click();    
        };
        $('.downloads a[data-href="downloads-'+ind+'"]').click(fn);          
    });
})(jQuery);