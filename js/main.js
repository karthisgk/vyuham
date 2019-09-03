(function ($) {
  "use strict";

  // Preloader (if the #preloader div exists)
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove();
      });
    }
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Header scroll class
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (! $('#header').hasClass('header-scrolled')) {
            top_space = top_space - 40;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.main-nav, .mobile-nav');
  var main_nav_height = $('#header').outerHeight();

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();
  
    nav_sections.each(function() {
      var top = $(this).offset().top - main_nav_height,
          bottom = top + $(this).outerHeight();
  
      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active');
        main_nav.find('a[href="#'+$(this).attr('id')+'"]').parent('li').addClass('active');
      }
    });
  });

  // jQuery counterUp (used in Whu Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Porfolio isotope and filter
  const isoTope = function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    });
    $('#portfolio-flters li').on( 'click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');
  
      portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });
  };
  //$(window).on('load', isoTope);

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  });
  
  const getSponsorsCallback = function( sponsors ) {
    if(sponsors.length){
      sponsors.forEach((sp, ind) => {
        const ele = $('<img src="'+sp.logo+'" alt="" />');
        $('.clients-carousel').append(ele);
      });
      $(".clients-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 }
        }
      });
    }
  };
  /*$.ajax({
    type: 'post',
    url: 'http://me.karthisgk.be/vyuham/sponsors.json',
    dataType: 'json',
    success: getSponsorsCallback
  });*/

  firebase.database().ref('sponsors').once('value',function(snapshot) {
    var sponsors = [];
    snapshot.forEach(function(childSnapshot) {
      sponsors.push(childSnapshot.val());
    });
    getSponsorsCallback(sponsors);
  });

  const getInputs = () => {
    return {
      teamName: $('#team-name').val(),
      collegeName: $('#college-name').val(),
      mobNo: $('#mob-no').val().replace(/^\+/, ''),
      topic: $('#topic').val(),
      teamSize: $('#team-size').val()
    };
  };
  
  const fileUploader = (e) => {
    var file = e.target.files[0];
    var $button = $('div.ds-notes .btn-get-started');
    var error = $('div.ds-notes .error');
    var success = $('div.ds-notes .success');
    var progress = $('#uploader');
    var message = '';

    if(!/^video/.test(file.type)){
      message = 'not accepted '+file.type+'. \
        you must upload a video';
    }
    if(file.size > 50000000){
      message = 'file size too large. video must be below 50mb';
    }
    if(message != ''){
      if(error.length == 0)
        $button.after('<p class="error">'+message+'</p>');
      else
        error.html(message);
      return;
    }
    error.html('');    
    const afterSuccess = (inputs) => {
      firebase.database().ref('teams/' + inputs.mobNo).set(inputs);
      message = 'uploaded sucessfull';
      if(success.length == 0)
        $button.after('<p class="success">'+message+'</p>');
      else
        success.html(message);
      $button.remove();
      $('.form-inputs').remove();
      progress.hide();
    };
    progress.show();
    $button.prop('disabled', true);
    var inputs = getInputs();
    inputs.fileName = 'vyuham_' + inputs.mobNo +'_'+ file.name;
    var task = firebase.storage().ref('/directorshow/' + inputs.fileName).put(file);
    task.on('state_changed', (snapshot) => {
      var p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress.val(p);
    }, (error) => {
      error.html('something wrong!');
      $button.prop('disabled', false);
    }, () => afterSuccess(inputs));
  };
  $('#file-upload').change(fileUploader);  
  $('div.ds-notes .btn-get-started').click((e) => {
    var inputs = getInputs();
    var $button = $('div.ds-notes .btn-get-started');
    var error = $('div.ds-notes .error');
    var message = '';

    if(inputs.mobNo.length == 0 ||
      inputs.teamName.length == 0 ||
      inputs.collegeName.length == 0 ||
      inputs.topic.length == 0 ||
      inputs.teamSize.length == 0){
      message = 'fill the inputs';
    }

    else if(inputs.mobNo.length < 10)
      message = 'Enter valid mobile number.';

    if(message != ''){
      if(error.length == 0)
        $button.after('<p class="error">'+message+'</p>');
      else
        error.html(message);
      return;
    }
    error.html('');    
    $('#file-upload').click();
  });
  // firebase.database().ref('videos/zsFYtBwtHCE').set({
  //   name: 'Bigil',
  //   image: 'https://img.youtube.com/vi/zsFYtBwtHCE/hqdefault.jpg',
  //   url: 'https://www.youtube.com/watch?v=zsFYtBwtHCE'
  // });
  firebase.database().ref('videos').once('value',function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      const video = childSnapshot.val();
      const element = '\
          <div class="col-lg-3 col-md-6 wow fadeInUp">\
            <div class="member">\
              <img src="'+video.image+'" class="img-fluid" alt="">\
              <div class="member-info">\
                <a href="'+video.url+'" class="play-video">\
                  <h4>'+video.name+'</h4>\
                </a>\
              </div>\
            </div>\
          </div>';
      $('#mvideos').append(element);
    });
    //magnify popup
    $('.play-video').magnificPopup({
      disableOn: 700,
      type: 'iframe',
      mainClass: 'mfp-fade',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
  });

  firebase.storage().ref().child('gallery').listAll().then((res) => {
    var imageCount = 0;
    res.items.forEach(function(itemRef) {
      var imageRef = firebase.storage().ref().child(itemRef.location.path);
      imageRef.getDownloadURL().then((url) => {
        imageCount++;
        const element = '\
          <div class="col-lg-4 col-md-6 portfolio-item filter-app">\
            <div class="portfolio-wrap">\
              <img src="' + url +'" class="img-fluid" alt="">\
              <div class="portfolio-info">\
                <div>\
                  <a href="' + url +'" data-lightbox="portfolio" data-title="" class="link-preview" title="Preview"><i class="ion ion-eye"></i></a>\
                  <a href="' + url +'" target="_blank" class="link-details" title="open new"><i class="ion ion-android-open"></i></a>\
                </div>\
              </div>\
            </div>\
          </div>';
        $('#mgallery').append(element);        
        if(imageCount == res.items.length){
          isoTope();
          window.macy = Macy({container: '#mgallery',trueOrder: false,waitForImages: false,
            margin: 0,columns: 3,breakAt: {
                1200: 4,
                991: 4,
                940: 3,
                520: 1,
                400: 1
            }
          });
        }
      });
    });
  }).catch((err) => {console.log(err)});
})(jQuery);

