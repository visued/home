/**
 * Created by Mohsen on 9/30/2016.
 */
var commands = [];          //history of commands for arrow keys
var currentcommand = -1;    //pointer for up and down arrow key
var isInsertable = true;    //boolean to check when to insert command to commands array
var terminalIcon = 'free'; //'free' or 'selected' for changing the background color of terminal icon
window.onload = function() {
    document.getElementById('command').onkeydown = function (event) {
        var e = event || window.event;
        if (e.keyCode == 13) { //user hits Enter
            process();
        }
        else if(e.keyCode == 38){ //user hits up arrow key
            setCommandFromHistory('up');
        }
        else if(e.keyCode == 40){ //user hits down arrow key
            setCommandFromHistory('down');
        }
    };
    document.onclick = function (event) {
        console.log(event.target.parentNode);
        if(event.target.parentNode.id == 'icon'){
            if(terminalIcon == 'free') {
                document.getElementById("iconname").style.backgroundColor = '#e46b37';
                terminalIcon = 'selected';
            }
        }
        else if(event.target.parentNode.id == 'bar'){
            document.getElementById('console').style.display = 'none';
        }
        else{
            document.getElementById("iconname").style.backgroundColor = 'transparent';
            terminalIcon = 'free';
        }
    };
    $( "#icon" ).dblclick(function() {
        document.getElementById('console').style.display = 'block';
        var removables = document.getElementsByClassName('results');
        var numremovables = removables.length;
        for (var i=0 ; i<numremovables; i++){
            //remove the first element cause first element changes after every removing
            document.getElementById('history').removeChild(removables[0]);
        }
        currentcommand = -1;
        commands = [];
    });

}
function process() {
//general things to do for all comands before executing known commands
    var command = document.getElementById('command').value;
    var history = document.getElementById("history");
    var para = document.createElement("p");
    para.setAttribute('class', 'results');
    //var node = document.createTextNode("user@victorsued.com:~$ "+command);
    para.innerHTML = "user@victorsued.com:~$ "+command;
    //para.appendChild(node);
    history.appendChild(para);
    if(isInsertable){
        commands.unshift(command);
    }
    else{
        isInsertable = true;
        currentcommand = -1;
    }
    document.getElementById('command').value = ""
    if(command.toLowerCase() == "help"){
        var par = document.createElement("p");
        par.setAttribute('class', 'results');
        par.innerHTML = "list of possible commands are: <br>" +
            "<span class='color'> download resume:</span> to generate a link to my resume in pdf format <br>" +
            "<span class='color'>change background:</span> to randomly change the picture in the background to another space cat image! <br>" +
            "<span class='color'>bio:</span> to get a brief inroduction of me <br>" +
            "<span class='color'>clear:</span> to clear the terminal from previous commands<br>" +
            "<span class='color'>projects:</span> to get the links to my projects including this website<br><br>";
        history.appendChild(par);
    }
    else if(command.toLowerCase() == "download resume"){
        var link = document.createElement("a");
        var reslink = document.createTextNode("MohsenAnsariResume.pdf");
        link.setAttribute('href', "http://mohsenansari.com/resume/MohsenAnsariResume.pdf");
        link.setAttribute('class', 'results');
        link.setAttribute('target', "_blank");
        link.appendChild(reslink);
        history.appendChild(link);
    }
    else if(command.toLowerCase() == "change background"){
        var picnumber = Math.floor((Math.random() * 10) + 1);
        console.log(picnumber);
        document.body.style.background = "url(\"./bkg/bkg"+picnumber+".jpg\")";
        document.body.style.backgroundSize = "100%";
    }
    else if(command.toLowerCase() == "clear"){
        var removables = document.getElementsByClassName('results');
        var numremovables = removables.length;
        for (var i=0 ; i<numremovables; i++){
            //remove the first element cause first element changes after every removing
            document.getElementById('history').removeChild(removables[0]);
        }
    }
    else if(command.toLowerCase() == "bio"){
        var par = document.createElement("p");
        par.setAttribute('class', 'results');
        par.innerHTML = "Thanks for your interest in my bio! <br>" +
        "My name is Victor Sued, I was born in 1991." +
            "I like developing websites and building softwares. As you can see, I also like to make unusual websites. <br>" +
            "If you've got any feedback for this website or you want to contact me, you can send me an email to this address: " +
            "<a href=\'mailto:visued@gmail.com\' target='_blank'>visued@gmail.com</a><br>" +
            "You can also check my <a href=\'https://www.linkedin.com/in/victor-sued-01512637/' target='_blank'>LinkedIn</a> profile or look at my resume to know more about my technical skills. <br>";
        history.appendChild(par);
    }
    else if(command.toLowerCase() == "projects"){
        var par = document.createElement("p");
        par.setAttribute('class', 'results');
        par.innerHTML = "Well I've done multiple projects that aren't visible online anymore. <br>" +
            "But here are the ones that are available: <br><br>" +
            "<a href='http://fiscaliza.herokuapp.com' target='_blank'> Fiscaliza WebApp:</a><br><br>";
        history.appendChild(par);
    }
    else if(command.toLowerCase() == ""){
        //just do nothing (to prevent command not found)
    }
    else{
        var para = document.createElement("p");
        para.setAttribute('class', 'results');
        var node = document.createTextNode(command+": command not found");
        para.appendChild(node);
        history.appendChild(para);
    }
    //auto scrolling to command line view at the end
    document.getElementById( 'command' ).scrollIntoView();
}

//drag and drop for terminal window;
interact('#bar')
    .draggable({
        intertia: true,
        onstart: function (event) {
            document.getElementById('bar').style.cursor = 'default';
        },
        onmove: dragMoveListener,
        onend: function (event) {
            document.getElementById('bar').style.cursor = 'default';
        }
    });

function dragMoveListener (event) {
    document.getElementById('bar').style.cursor = 'move';
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.parentNode.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.parentNode.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.parentNode.webkitTransform =
        target.parentNode.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.parentNode.setAttribute('data-x', x);
    target.parentNode.setAttribute('data-y', y);
}
function getfocus() {
    document.getElementById("command").focus();
}
function setCommandFromHistory(key) {
    if(key == 'up'){
        if(currentcommand < commands.length - 1){
            currentcommand ++;
            document.getElementById('command').value = commands[currentcommand];
            isInsertable = false;
        }
    }
    else if(key == 'down'){
        if(currentcommand > 0){
            currentcommand--;
            document.getElementById('command').value = commands[currentcommand];
            isInsertable = false;
        }
        else if(currentcommand == 0){
            currentcommand--;
            document.getElementById('command').value = "";
        }
    }
    console.log(currentcommand);
}
//drag and frop for terminal icon
interact('#icon')
    .draggable({
        intertia: true,
        onmove: dragMoveListener2,
        snap: { mode: 'grid',
            grid: {
                x: 100,
                y: 100
            },
            gridOffset: {
                x: 20,
                y: 10
            },
            range: Infinity // can also use -1 which gets changed to Infinity
        }
    });
function dragMoveListener2 (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
