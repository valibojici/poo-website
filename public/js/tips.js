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




let offcanvas = $('.offcanvas')[0];
let bsoffcanvas = new bootstrap.Offcanvas(offcanvas);


$('#offcanvas-nav a').on('click', e=>{
    e.preventDefault();
    let targetId = e.target.getAttribute('href')
    let target = $(`${targetId}`)[0];
    
    bsoffcanvas.hide();

    function scrollTo(event){
        target.scrollIntoView(true);
        removeEventListener('hidden.bs.offcanvas', scrollTo);
    }

    addEventListener('hidden.bs.offcanvas', scrollTo);
})
