function formatAndHighlight(){
    function copyToClipboard(elements) {
        // from stack overflow
        if (!elements.length) {
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
        for (let elem of elements) {
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
    
    
    function getNumberedCodeBlock(code) {
        // to do in python script?
        let $codeblockContainer = $('<div/>').addClass('codeblock-container');
        let $codeblockOuterContainer = $('<div/>').addClass('codeblock-outer-container');
    
        let $linesContainer = $('<div/>').addClass('lines-container');
        let lineColors = ['#e0e0e0', '#e7e7e7'];
        let count = 0;
        for (let line of code.split('\n')) {
            count++;
            let $innerContainer = $('<div/>');
            let $numberContainer = $('<span/>').addClass('noselect line-no').append($('<span/>').text(count));
            let $code = $('<code/>').addClass('language-cpp').text(`${(line.length) ? line : ''}`);
            
            let $line = $('<pre/>').append($code).addClass('line-code');
            
            $innerContainer.append($numberContainer).append($line);
    
            $linesContainer.append($innerContainer);
        }
    
        $codeblockContainer.append($linesContainer);
    
        // create header div with copy btn in it
        let $codeHeader = $("<div/>").addClass('codeblock-header bg-dark d-flex');
        let $cpyBtn = $("<a><i class=\"bi bi-clipboard me-2\"></i> Copy</a>").addClass('btn btn-sm btn-altdark copy-btn');
        $cpyBtn.on('click', e=>{
            e.preventDefault();
            copyToClipboard($linesContainer[0].querySelectorAll("code"));
    
            $cpyBtn.html('<i class="bi bi-clipboard-check"></i>');
            $cpyBtn.addClass('green');
            setTimeout(() => {
                $cpyBtn.html('<a><i class=\"bi bi-clipboard me-2\"></i> Copy</a>');
                $cpyBtn.removeClass('green');
            }, 1000);
        });
        $codeHeader.append($cpyBtn);
    
        $codeblockOuterContainer.append($codeHeader);
        $codeblockOuterContainer.append($codeblockContainer);
    
        return $codeblockOuterContainer;
    }

    let divs = []
    $('pre.block > code').each((index, elem) => {
        let code = elem.innerText;
       divs.push(getNumberedCodeBlock(code));
    });

    $('pre.block').each((index, elem) => {
 
        $(elem).replaceWith(divs[index]);
    })

    $('pre code').get().forEach(elem => hljs.highlightElement(elem));
}