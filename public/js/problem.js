function changeButtonsSize(media) {
    function addRemoveClass(selector, addClass, removeClass) {
        $(`${selector}`).addClass(addClass);
        $(`${selector}`).removeClass(removeClass);
    }

    if (media.matches) { // If media query matches
        $('#main-container').css({height : `initial`});

        $('span.btn').addClass('btn-sm');
        $('#solution').removeClass('lead');

        

        addRemoveClass('.next-btn', 'btn-success', 'btn-outline-success');
        addRemoveClass('.prev-btn', 'btn-warning', 'btn-outline-warning');
        addRemoveClass('#copy-btn', 'btn-altlight', 'btn-outline-altlight');
        addRemoveClass('#correct-btn', 'btn-success', 'btn-outline-success');
        addRemoveClass('#incorrect-btn', 'btn-warning', 'btn-outline-warning');


    } else {
        $('#main-container').css({height : `${ $(window).height() - parseFloat($('#navbar-container').css('height'))}px`});
        $('span.btn').removeClass('btn-sm');
        $('#solution').addClass('lead');

        addRemoveClass('.next-btn', 'btn-outline-success', 'btn-success');
        addRemoveClass('.prev-btn', 'btn-outline-warning', 'btn-warning');
        addRemoveClass('#copy-btn', 'btn-outline-altlight', 'btn-altlight');
        addRemoveClass('#correct-btn', 'btn-outline-success', 'btn-success');
        addRemoveClass('#incorrect-btn', 'btn-outline-warning', 'btn-warning');
    }
}

let media = window.matchMedia("(max-width: 992px)");

changeButtonsSize(media) // Call listener function at run time
$(media).on('change', () => {
    changeButtonsSize(media);
});




async function getProblems() {
    // get all problems from github repo
    let data = await fetch('https://raw.githubusercontent.com/valibojici/poo-website/main/assets/output.json');
    data = await data.json();
    data = data.content;
    return data;
}

let problems = getProblems();

problems.then((problems)=>{
    // TO DO filter problmes handle no problems situation

    $("#loading-container").addClass('d-none');

    console.log(problems);
    addEventsToButtons(problems);
    loadProblem(problems[0]);
    $("#main-container").removeClass('d-none');
});

function addEventsToButtons(data) {
    let problemIndex = 0;
    let problems = data;
    
    // next and prev problem buttons
    
    $('.next-btn, .prev-btn').on('click', (event) => {
        let $buttonPressed = $(event.target);
        $buttonPressed.blur();
        if ($buttonPressed.hasClass('next-btn')) {
            problemIndex = (problemIndex == problems.length - 1) ? 0 : problemIndex + 1;
        } else {
            problemIndex = (problemIndex <= 0) ? problems.length - 1 : problemIndex - 1;
        }
        loadProblem(problems[problemIndex]);
        // scroll to the top
        $(window).scrollTop($('body').offset().top);
    });

    $('.next-btn, .prev-btn').on('dblclick', false);

    // prompt buttons
    $('#correct-btn, #incorrect-btn').on('click', event => {
        // animate prompt to fade
        $('#prompt').animate({
            opacity: 0
        }, 200, () => {
            $("#prompt").addClass('d-none');

            $("#prompt").css({
                opacity: 100
            });

            // hide prompt first then show solution
            $('#solution-container').removeClass('d-none');

            // scroll to solution (for mobile)
            $(window).scrollTop($('#solution-container').offset().top);
        });
    });

    // copy button
    $('#copy-btn').on('click', e => {
        copyToClipboard(document.querySelectorAll("#problem code"));
        let originalText = $("#copy-btn").html();
        $("#copy-btn").html('Text copiat!');
        setTimeout(() => {
            $("#copy-btn").html(originalText);
        }, 1500);
    });
}


function loadProblem(data) {
    $("#loading-container").removeClass('d-none');
    $("#main-contaniner").addClass('d-none');
    // puts problem content on page, hides solution and shows prompt 
    // also highlights with highlightsjs
    let code = data.problem;
    let solution = data.solution;
    let id = data.id;

    $('#id-problema').text(`${id}`);
    $("#problem").empty().append(getNumberedCodeBlock(code));
    $('#solution').html(solution);

    $('pre code').get().forEach(elem => hljs.highlightElement(elem));

    $('#prompt').removeClass('d-none');
    $('#solution-container').addClass('d-none');

    $("#loading-container").addClass('d-none');
    $("#main-contaniner").removeClass('d-none');
}


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
    let div = document.createElement('div');
    div.id = 'lines-container';

    let count = 0;
    for (let line of code.split('\n')) {

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