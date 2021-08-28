$('body').css({'padding-top': parseFloat($('#navbar-container').css('height'))});

let mq = window.matchMedia('(max-width: 768px)');

removeLeadParagraphsOnMobile(mq);

$(mq).on('change', ()=>{removeLeadParagraphsOnMobile(mq)});

function removeLeadParagraphsOnMobile(media){
    if(media.matches){
        $(".article-content ").removeClass('lead');
    } else {
        $(".article-content ").addClass('lead');
    }
}


// let scrollTimeout;
// addEventListener('scroll', function(e) {
//     clearTimeout(scrollTimeout);
//     scrollTimeout = setTimeout(function() {
//         console.log('Scroll ended');
//     }, 100);
// });

let offcanvas = $('.offcanvas')[0];
let bsoffcanvas = new bootstrap.Offcanvas(offcanvas);
$('#dis').on('click', e=>{
 
    let targetId = e.target.getAttribute('target')
    let target = $(`#s3`)[0];
    target.scrollIntoView();
    
    bsoffcanvas.toggle();
})
