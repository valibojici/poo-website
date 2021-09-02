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
});

let divs = $('pre.block > code').map((index, elem) => getNumberedCodeBlock($(elem).text()))

$('pre.block').each((index, elem) => {
    let $outerDiv = $('<div></div>').addClass('codeblock-container').append(divs[index]);
    $(elem).replaceWith($outerDiv);
});


$('pre code').each((index, elem) => hljs.highlightElement(elem))


function getNumberedCodeBlock(code) {
    // to do in python script?
    let $container = $('<div/>').addClass('lines-container');
    let lineColors = ['#e0e0e0', '#e7e7e7'];
    let count = 0;
    for (let line of code.split('\n')) {
        count++;
        let $innerContainer = $('<div/>');
        let $numberContainer = $('<span/>').addClass('noselect line-no').append($('<span/>').text(count));
        let $code = $('<code/>').addClass('language-cpp').text(`${(line.length) ? line : ''}`);
        
        let $line = $('<pre/>').append($code).addClass('line-code');
        
        $innerContainer.append($numberContainer).append($line);

        $container.append($innerContainer);
    }

    return $container;
}
