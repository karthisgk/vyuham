(function ($) {
	const isoTope = function () {
	    var portfolioIsotope = $('.portfolio-container').isotope({
	      itemSelector: '.portfolio-item'
	    });
	    $('#portfolio-flters li').off('click').on( 'click', function() {
	        $("#portfolio-flters li").removeClass('filter-active');
	        $(this).addClass('filter-active');
	  
	        //portfolioIsotope.isotope({ filter: $(this).data('filter') });
	        const filter = $(this).data('filter');
	        if(filter != '*') {
	            $('.portfolio-item').css('display', 'none');
	            $('.portfolio-item'+filter).css('display', 'block');
	        }else
	            $('.portfolio-item').css('display', 'block');
	        if(window.macy)
	            window.macy.recalculate(true, true);
	    });
  	};
  	const applyMacy = () => {
        window.macy = Macy({container: '#mgallery',trueOrder: false,waitForImages: false,
            margin: 0,columns: 3,breakAt: {
                1200: 4,
                991: 4,
                940: 3,
                520: 1,
                400: 1
            }
        });
        $('.portfolio-item img').off('load').on('load', (e) => {
            window.macy.recalculate(true, true);
        });
    };
	const getElement = (lightUrl, url, yr) => {
        const element = '\
              <div class="col-lg-4 col-md-6 portfolio-item filter-'+yr+'">\
                <div class="portfolio-wrap">\
                  <img src="' + lightUrl +'" class="img-fluid" alt="">\
                  <div class="portfolio-info">\
                    <div>\
                      <a href="' + url +'" data-lightbox="portfolio" data-title="" class="link-preview" title="Preview"><i class="ion ion-eye"></i></a>\
                      <a href="' + url +'" target="_blank" class="link-details" title="open new"><i class="ion ion-android-open"></i></a>\
                    </div>\
                  </div>\
                </div>\
              </div>';
        return element;
    }
	window.baseURL = location.protocol + "//" + location.host + location.pathname;
    const images = {
      	"2k14": "IMG_2377.JPG.jpeg,@,IMG_2362.JPG.jpeg,@,IMG_1853.JPG.jpeg,@,IMG_1845.JPG.jpeg,@,IMG_1839.JPG.jpeg,@,IMG_1823.JPG.jpeg,@,IMG_1663.JPG.jpeg,@,IMG_2347.JPG.jpeg,@,IMG_2325.JPG.jpeg,@,IMG_2228.JPG.jpeg,@,IMG_2174.JPG.jpeg,@,IMG_2170.JPG.jpeg,@,IMG_2103.JPG.jpeg,@,IMG_2071.JPG.jpeg,@,IMG_1905.JPG.jpeg".split(',@,'),
      	"2k16": "DSC_9999.JPG.jpeg,@,DSC_9995.JPG.jpeg,@,DSC_0009.JPG.jpeg,@,DSC_0008.JPG.jpeg,@,DSC_9984.JPG.jpeg,@,DSC_9965.JPG.jpeg,@,DSC_9956.JPG.jpeg,@,DSC_9954.JPG.jpeg,@,DSC_9949.JPG.jpeg,@,DSC_9941.JPG.jpeg,@,DSC_9936.JPG.jpeg,@,DSC_0014.JPG.jpeg".split(',@,'),
      	"2k18": "DSC_0698.JPG.jpeg,@,DSC_0692.JPG.jpeg,@,DSC_0342.JPG.jpeg,@,DSC_0310.JPG.jpeg,@,DSC_0267.JPG.jpeg,@,DSC_0685.JPG.jpeg,@,DSC_0582.JPG.jpeg,@,DSC_0572.JPG.jpeg,@,DSC_0558.JPG.jpeg,@,DSC_0408.JPG.jpeg,@,DSC_0403.JPG.jpeg,@,DSC_0380.JPG.jpeg,@,DSC_0345.JPG.jpeg".split(',@,')
    };
    $('#mgallery').html('');
    Object.keys(images).forEach((year) => {
      images[year].forEach(function(itemRef,ind) {
          const url = window.baseURL + "img/gallery/" + year + "/" + itemRef; 
          $('#mgallery').append(getElement(url, url, year));
          if((ind + 1) == images[year].length){
              isoTope();
              applyMacy();
          }            
      });
    });
	const downloads = ['brouchure.jpg'];
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