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


  new ClipboardJS('.btn');

let index = 0;
let data = null;

async function load(){
    data = await fetch('https://raw.githubusercontent.com/valibojici/poo-website/main/assets/output.json');
    data = await data.json();
    
    
    $('#next-btn').on('click', async ()=>{
        // let data = await fetch('https://gist.githubusercontent.com/valibojici/f6806c38994cbbcabe0e3872f0ed15b8/raw/395c4115d6fdaeca10933382868a215301929c84/test2.cpp');
       
        let content = data.content;
    
        let code = content[index].problem;
        let solution = content[index].solution;
        
    
        $("#problem").empty().append(getNumberedCodeBlock(code));
        $('#solution').html(decodeHtml(solution));
     
        index++;
        index = index % content.length;

        // $("#problem").find("pre code").each(el => console.log($(this).text()));
        for(let el of document.querySelectorAll('pre code')){
            hljs.highlightElement(el);
        }
        
    });
    
}

load();

$('#copy-btn').on('click', e =>{
    copyToClipboard(document.querySelector("#problem code"));
});

function copyToClipboard (element) {
    // Create a new textarea element and give it id='temp_element'
    const textarea = document.createElement('textarea')
    textarea.id = 'temp_element'
    // Optional step to make less noise on the page, if any!
    textarea.style.height = 0
    // Now append it to your page somewhere, I chose <body>
    document.body.appendChild(textarea)
    // Give our textarea a value of whatever inside the div of id=containerid
    textarea.value = element.innerText
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