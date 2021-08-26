function changeButtonsSize(media) {

    function addRemoveClass(selector, addClass, removeClass){
        $(`${selector}`).addClass(addClass);
        $(`${selector}`).removeClass(removeClass);
    }

    if (media.matches) { // If media query matches

        $('span.btn').addClass('btn-sm');

        addRemoveClass('.next-btn', 'btn-success', 'btn-outline-success');
        addRemoveClass('.prev-btn', 'btn-warning', 'btn-outline-warning');
        addRemoveClass('#copy-btn', 'btn-altlight', 'btn-outline-altlight');
        addRemoveClass('#correct-btn', 'btn-success','btn-outline-success');
        addRemoveClass('#incorrect-btn', 'btn-warning','btn-outline-warning');


    } else {
        $('span.btn').removeClass('btn-sm');

        addRemoveClass('.next-btn','btn-outline-success', 'btn-success');
        addRemoveClass('.prev-btn','btn-outline-warning', 'btn-warning' );
        addRemoveClass('#copy-btn','btn-outline-altlight', 'btn-altlight');
        addRemoveClass('#correct-btn','btn-outline-success', 'btn-success');
        addRemoveClass('#incorrect-btn','btn-outline-warning', 'btn-warning');
    }
  }
  var media = window.matchMedia("(max-width: 992px)");

  changeButtonsSize(media) // Call listener function at run time
  $(media).on('change', ()=>{
      changeButtonsSize(media);
  });

let index = -1;
let data = null;

async function load(){
    data = await fetch('https://raw.githubusercontent.com/valibojici/poo-website/main/assets/output.json');
    data = await data.json();

    $('.next-btn').on('click', ()=>{
        let content = data.content;
        
        index = (index == content.length-1) ? 0 : index + 1;
    
        let code = content[index].problem;
        let solution = content[index].solution;
        let id = content[index].id;
        
        $('#id-problema').text(`${id}`);
        $("#problem").empty().append(getNumberedCodeBlock(code));
        $('#solution').html(decodeHtml(solution));
     
        document.querySelectorAll('pre code').forEach(elem => hljs.highlightElement(elem)); 
        
        $('#prompt').removeClass('d-none');
        $('#solution-container').addClass('d-none');

        $(window).scrollTop($('body').offset().top);
    });

    $('.prev-btn').on('click', ()=>{
        // let data = await fetch('https://gist.githubusercontent.com/valibojici/f6806c38994cbbcabe0e3872f0ed15b8/raw/395c4115d6fdaeca10933382868a215301929c84/test2.cpp');
       
        let content = data.content;

        index = (index == 0) ? content.length - 1 : index-1;
    
        let code = content[index].problem;
        let solution = content[index].solution;
        let id = content[index].id;
        
        $('#id-problema').text(`${id}`);
    
        $("#problem").empty().append(getNumberedCodeBlock(code));
        $('#solution').html(decodeHtml(solution));
        
        document.querySelectorAll('pre code').forEach(elem => hljs.highlightElement(elem));   
        
        $('#prompt').removeClass('d-none');
        $('#solution-container').addClass('d-none');

        $(window).scrollTop($('body').offset().top);
    });
    
    $('.next-btn').first().trigger('click');

    $('#correct-btn, #incorrect-btn').on('click', event=>{
        $('#prompt').animate({ opacity : 0,}, 200, ()=>{
            $("#prompt").addClass('d-none');            
            $("#prompt").css({opacity : 100});
            $('#solution-container').removeClass('d-none');
            
            $(window).scrollTop($('#solution-container').offset().top);
        });
        
    })
}

load();


$('#copy-btn').on('click', e =>{
    copyToClipboard(document.querySelectorAll("#problem code"));
    let originalText = $("#copy-btn").html();
    $("#copy-btn").html('Text copiat!');
    setTimeout(()=>{
        $("#copy-btn").html(originalText);
    }, 1500);
});

function copyToClipboard (elements) {
    if(!elements.length){
        elements = [elements];
    }
    // Create a new textarea element and give it id='temp_element'
    const textarea = document.createElement('textarea')
    textarea.id = 'temp_element'
    // Optional step to make less noise on the page, if any!
    textarea.style.height = 0
    // Now append it to your page somewhere, I chose <body>
    document.body.appendChild(textarea)
    // Give our textarea a value of whatever inside the elements
    for(let elem of elements){
        textarea.value += (elem.innerText.trim()) ? elem.innerText + '\n' : '\n';
    }
    textarea.value = textarea.value.trim();
    // Now copy whatever inside the textarea to clipboard
    const selector = document.querySelector('#temp_element')
    selector.select()
    document.execCommand('copy')
    // Remove the textarea
    document.body.removeChild(textarea)
  }


  function getNumberedCodeBlock(code){
    let div = document.createElement('div');
    div.id = 'lines-container';

    let count = 0;
    for(let line of code.split('\n')){
        
        count++;
        let span = document.createElement('span');
        let number = document.createElement('span');
        number.textContent = count;
        number.classList.add('noselect');
        number.classList.add('line-no');

        
        let pre = document.createElement('pre');
        pre.classList.add('line-code')
        
        let code = document.createElement('code');
        code.classList.add('language-cpp');

        code.textContent = (line.length > 0) ? line : '\n';
        pre.appendChild(code);

        span.appendChild(number)
        span.appendChild(pre);

        span.style.display = 'flex';
        div.appendChild(span);
    }

    return div;
}

  
  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}