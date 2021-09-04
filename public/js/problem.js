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


$(window).on('resize', ()=>{
    if(!media.matches){
        $('#main-container').css({height : `${ $(window).height() - parseFloat($('#navbar-container').css('height'))}px`});
    } else {
        $('#main-container').css({height : `initial`});
    }
});

$('#search').on('submit', e=>{
    e.preventDefault();
    let num = $('#search input')[0].value.trim();
    if(!isNaN(Number(num))){
        let url = new URL(window.location.href.split('?')[0]);
        url.searchParams.append('id', Number(num));
        window.location.href = url.href;
    } else {
        $('#search input')[0].value = '';
    }
})

async function getProblems() {
    // get all problems from github repo
    let data = await fetch('https://raw.githubusercontent.com/valibojici/poo-website/main/assets/output.json');
    // let data = await fetch('http://localhost:3000/get', {method: 'get'});
    data = await data.json();

    data = data.content;
    return data; 
}

getProblems().then((problems)=>{
    $("#loading-container").addClass('d-none');
 
    const parsedUrl = new URL(window.location.href);
    const urlSearchParams = new URLSearchParams(parsedUrl.search);
    
    if(urlSearchParams.has('id')){
        let id = parseInt(urlSearchParams.get('id'));
        problems = problems.filter(problem => problem.id === id);
    } else {
        
        if(urlSearchParams.has('t')){
            let tags = urlSearchParams.get('t').split(',');
            problems = problems.filter(problem => tags.every(tag => problem.tags.includes(tag)) );
        }
    
        if(urlSearchParams.has('ot')){
            let tags = urlSearchParams.get('ot').split(',');
            problems = problems.filter(problem => tags.some(tag => problem.tags.includes(tag)) );
        }

        if(urlSearchParams.has('order')){
            let ord = urlSearchParams.get('order');
            if(ord === 'asc') problems.sort((p1, p2) => p1.id < p2.id ? -1 : 1);
            else 
            if(ord === 'desc') problems.sort((p1,p2) => p1.id < p2.id ? 1 : -1);
            else 
            if(ord === 'random') shuffle(problems);
        }
    }

    // test if problems array is empty
    if(problems.length === 0){
        $('#no-problems').removeClass('d-none');
    } else {
        addEventsToButtons(problems);
        loadProblem(problems[0]);
        $("#main-container").removeClass('d-none');
    }
}).catch(err => console.log(err));





function addEventsToButtons(data) {
    let problemIndex = 0;
    let problems = data;

    if(problemIndex == 0){
        $('.prev-btn').addClass('disabled');
    } else {
        $('.prev-btn').removeClass('disabled');
    }

    if(problemIndex == problems.length-1){
        $('.next-btn').addClass('disabled');
    } else {
        $('.next-btn').removeClass('disabled');
    }
    
    // next and prev problem buttons
    
    $('.next-btn, .prev-btn').on('click', (event) => {
        let $buttonPressed = $(event.target);
        $buttonPressed.blur();
        if ($buttonPressed.hasClass('next-btn')) {
            if(problemIndex + 1 < problems.length) problemIndex++;
            
        } else {
            if(problemIndex - 1 >= 0) problemIndex--;
        }
        loadProblem(problems[problemIndex]);

        if(problemIndex == 0){
            $('.prev-btn').addClass('disabled');
        } else {
            $('.prev-btn').removeClass('disabled');
        }

        if(problemIndex == problems.length-1){
            $('.next-btn').addClass('disabled');
        } else {
            $('.next-btn').removeClass('disabled');
        }

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

            let isCorrect = problems[problemIndex].tags.includes('correct') == $(event.target).is("#correct-btn");

            $('#feedback').text(isCorrect ? 'CORECT !' : 'GRESIT !');
            $('#feedback').css({color : `${isCorrect ? 'green' : 'red'}`});

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

    let divs = []
    $('#solution pre.block > code').each((index, elem) => {
        let code = elem.innerText;
       divs.push(getNumberedCodeBlock(code));
    });

    $('#solution pre.block').each((index, elem) => {
        let $outerDiv = $('<div></div>')
        $outerDiv.addClass('codeblock-container');
        $outerDiv.append(divs[index]);
        $(elem).replaceWith($outerDiv);
    })


    // for(let c of document.querySelectorAll('#solution pre.block > code')){
    //     let temp = c.innerText;
    //     $(c).empty().append(getNumberedCodeBlock(temp))
    // }

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


function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
}