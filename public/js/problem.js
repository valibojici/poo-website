function changeButtonsSize(media) {
    if (media.matches) { // If media query matches
        for(let btn of $('span.btn')){
            $(btn).addClass("btn-sm");
        }
    } else {
        for(let btn of $('span.btn')){
            $(btn).removeClass("btn-sm");
        }
    }
  }
  var media = window.matchMedia("(max-width: 768px)");

  changeButtonsSize(media) // Call listener function at run time
  $(media).on('change', ()=>{
      changeButtonsSize(media);
  });