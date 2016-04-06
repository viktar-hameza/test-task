$(function() {

// --------------------
//   jQuery
// --------------------
// header--sticky
  $(window).scroll(function () {
    $header = $(".header")
    if( $(window).scrollTop() >= 1 && !($header.hasClass("header--sticky"))){
      $header.addClass("header--sticky");
    } else if ($(window).scrollTop() <= 1){
      $header.removeClass("header--sticky");
    }
  });

// select
  $('select').each(function () {

    var $this = $(this),
      numberOfOptions = $(this).children('option').length;

    $this.addClass('s-hidden');
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next('div.styledSelect');
    $styledSelect.text($this.children('option').eq(0).text());
    var $list = $('<ul />', {
      'class': 'options'
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $('<li />', {
        text: $this.children('option').eq(i).text(),
        rel: $this.children('option').eq(i).val()
      }).appendTo($list);
    }

    var $listItems = $list.children('li');

    $styledSelect.click(function (e) {
      e.stopPropagation();
      $('div.styledSelect.active').each(function () {
        $(this).removeClass('active').next('ul.options').hide();
      });
      $(this).toggleClass('active').next('ul.options').toggle();
    });

    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass('active');
      $this.val($(this).attr('rel'));
      $list.hide();
    });

    $(document).click(function () {
      $styledSelect.removeClass('active');
      $list.hide();
    });
  });
});
// --------------------
//   JS
// --------------------
// menu
(function() {
  var link = document.querySelector(".shape-filter");
  var html= document.querySelector("html");
  var linkClose = document.querySelector(".shape-close");

  link.addEventListener("click", function(event) {
      event.preventDefault();
      html.classList.add("mob-menu");
    });

  linkClose.addEventListener("click", function(event) {
      event.preventDefault();
      html.classList.remove("mob-menu");
    });
})();

// popup
(function() {
  function popupRun(linkTarget) {
    var link = document.querySelector(linkTarget);
    var popup = document.querySelector(".popup");
    var close = document.querySelector(".mob-popup-close");
    var closeTwo = document.querySelector(".popup__shape-close");
    var mobPopap = document.querySelector("html");

    link.addEventListener("click", function(event) {
      event.preventDefault();
      mobPopap.classList.add("mob-popap");
      popup.classList.add("popup--show");
    });
    close.addEventListener("click", function(event) {
      event.preventDefault();
      mobPopap.classList.remove("mob-popap");
      popup.classList.remove("popup--show");
    });
    closeTwo.addEventListener("click", function(event) {
      event.preventDefault();
      mobPopap.classList.remove("mob-popap");
      popup.classList.remove("popup--show");
    })
    window.addEventListener("keydown", function(event) {
      if (event.keyCode === 27) {
        if (popup.classList.contains("popup--show")) {
          mobPopap.classList.remove("mob-popap");
          popup.classList.remove("popup--show");
        }
      }
    });
    
    popup.addEventListener("click", function(event) {
      if (event.target.classList.contains("popup--show")) {
          mobPopap.classList.remove("mob-popap");
          popup.classList.remove("popup--show");
      }
    });
  }
  popupRun(".card__link");
  popupRun(".card__link2");
})();