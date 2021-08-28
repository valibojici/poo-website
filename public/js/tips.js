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