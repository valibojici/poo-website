function formatAndHighlight(){
    function copyToClipboard(elements) {
        text = '';
        if (!elements.length) {
            elements = [elements];
        }

        for (let elem of elements) {
            text += (elem.innerText.trim()) ? elem.innerText + '\n' : '\n';
        }

        return navigator.clipboard.writeText(text.trim());
    }
    
    
    function getNumberedCodeBlock(code) {
        // to do in python script?
        let $codeblockContainer = $('<div/>').addClass('codeblock-container');
        let $codeblockOuterContainer = $('<div/>').addClass('codeblock-outer-container');
    
        let $linesContainer = $('<div/>').addClass('lines-container');
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
            copyToClipboard($linesContainer[0].querySelectorAll("code"))
            .then(()=>{
                $cpyBtn.html('<i class="bi bi-clipboard-check"></i>');
                $cpyBtn.addClass('green');
                setTimeout(() => {
                    $cpyBtn.removeClass('green');
                    $cpyBtn.html('<a><i class=\"bi bi-clipboard me-2\"></i> Copy</a>');
                }, 1000);
            })
            .catch((err)=>{
                console.log(err);
                $cpyBtn.html('Scuze, nu merge.');
            });
    
            
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