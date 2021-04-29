// Create a terminal instance
const term = new Terminal({
    fontFamily: "'Roboto Mono', monospace",
    fontSize: 12,
    cols: 150,
    rows: 12,
    cursorBlink: true,
    allowTransparency: true
});

// Start localEcho library
const localEcho = new LocalEchoController(term);

const writeSpeed = 10;

// var mailreg_full = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var mailreg = /.*@.*\..*/
// var mailreg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
var urlreg = /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/; //ALERT


var longOpening = 'Hello hacker x.\r\nIf you found that page, it means we will check your skills to join\r\nShenkar software engineers team.\r\nPlease keep the whole process discrete and make sure you have a hoodie.\r\n';
var opening = "hello\r\n";
var questions = [{
        //NAME
        "prompt": "Hackers nickname",
        "regex": /(?: [a-zA-Z]+){1,}/,
        "form_id": "nickname",
        "formValue": "value",
        "wronginput": "! Invalid Input: name must include letters from a-z only and a gap"
    },
    {
        //FAVORITE BROWSWE RADIO BUTTON SELECT GENDER
        "prompt": "Favorite browser",
        "type": "radio",
        "form_id": "radio",
        "formClass": "radio",
        "formValue": "checked"
    }, {
        //COFFEE DAYS SINCE ALERT NOT WORKING
        "prompt": "Days since last hack",
        "type": "number",
        // "form_id": "number",
        "formClass": "number",
    }, {
        //PASSWORD
        "prompt": "Penthagon's password",
        "regex": /(?=.*[A-Z])/, //must contain at least one uppercase alphabetical character
        "form_id": "passwordinput",
        "formValue": "value",
        "wronginput": "! Invalid Input: must contain at least one uppercase alphabetical character"
    }, {
        //MAIL
        "prompt": "e-mail address in darknet",
        "regex": mailreg,
        "form_id": "mail",
        "formValue": "value",
        "wronginput": "! Invalid Input: must include '@' and '.' symbols"
    }, {
        //URL
        "prompt": "Last website I hacked",
        "regex": urlreg,
        "form_id": "website",
        "formValue": "value",
        "wronginput": "! Invalid Input: URL should look like http(s)://(www.)domain.dns"
    }, {
        //PHONE
        "prompt": "Phone number of last victim",
        "regex": /[0-9]{9,10}/,
        "form_id": "phone",
        "formValue": "value",
        "wronginput": "! Invalid Input:9-10 numbers only"

    }, {
        "prompt": "Security rank",
        "type": "range",
        "formClass": "securityrank",
        "formValue": "value",
    }, {
        "prompt": "IP address",
        "regex": /.*/g, // Match anything
        "form_id": "address",
        "wronginput": "wronginput",
        "formValue":"value"
    },
    {
        "prompt": "Programming languages",
        "type": "checkbox",
        "formClass": "checkbox",
    },
    {
        "prompt": "IP Subnet Mask",
        "type": "select",
        "formClass": "subnetMask",
    }
];


var showText = async function (message, index, interval) {
    if (index < message.length) {
        term.write(message[index++]);
        await new Promise(resolve => setTimeout(function () {
            resolve(showText(message, index, interval));
        }, interval));
    }
};

var handle_question = async function (question) {
    await showText('~$ '+question.prompt, 0, writeSpeed); //print question to screen
    let valid = false; //the input is not ok- assumption
    while (!valid) {
        input = await localEcho.read(': ', '~$ ' + question.prompt);
        valid = input.match(question.regex)
        if (!valid) {
            await showText(question.wronginput, 0, writeSpeed)
        }
    }
    console.log(document.getElementById(question.form_id)[question.formValue]);
    document.getElementById(question.form_id)[question.formValue] = input
};

var custom_question = async function (question) {

    await showText('~$ '+question.prompt, 0, writeSpeed);
    var rows = document.getElementsByClassName('xterm-rows')[0]
    var row = document.createElement('div')
    var termSpan=term.renderer._spanElementObjectPool.acquire()

    var formClass = document.getElementsByClassName(question.formClass)

    for (node of formClass) {
        node.style.display = "inline"
    }
    console.log(question.formClass);

    termSpan.append(...formClass)

    row.appendChild(termSpan)
  
    var cursor = document.getElementsByClassName('terminal-cursor')

    var data_ids = []

    for (child of cursor[0].parentElement.children){
        data_ids.push(child.getAttribute('data-obj-id'))
    }
    term.renderer._spanElementObjectPool._inUse[data_ids[2]].innerHTML=''
    cursor[0].parentElement.children[cursor[0].parentElement.children.length-1].innerHTML=''
    row=cursor[0].parentElement.insertAdjacentElement('afterend', row)
    input = await localEcho.read(': ', '~$ ' + question.prompt); //waiting for enter to be pressed
    cursor[0].parentElement.children[cursor[0].parentElement.children.length-1].innerHTML=''

    var formClone = termSpan.cloneNode(true)
    for (node of formClone.childNodes) {
        node.style.display = "none"
    }
    document.getElementById("myForm").insertAdjacentElement('beforeend', formClone)    
}

window.onload = async () => {
    term.open(document.getElementById('terminal'), focus = true);
    term.fit()
    term.viewport.terminal.selectionManager.disable();

    await showText(longOpening, 0, writeSpeed);
    for (question of questions) {
        if (!question.type) {
            await handle_question(question); //for regular text questions
        } else {
            console.log("custom");
            await custom_question(question); //for special ones like radio
        }
    }

    await showText("~$ !@#$%^&*!@#$%^&*^%$#@!*&^%$#@! Hacking using your information now..", 0, writeSpeed);
    document.getElementById("myForm").submit();
};



// IN ORDER TO DISABLE THE SELECTION FUNCTIONALITY OF XTERMJS
// WE HAVE MODIFIED THE LIBRARY AND OR RECONFIGURED THE selectionManager
// Look for HERE comments in xtermjs for weak code locations