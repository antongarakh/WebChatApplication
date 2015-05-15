var uniqueID = function() {
    var date = Date.now();
    var random = Math.random() * Math.random();
    return Math.floor(date * random).toString();
};

var appState = {
    mainUrl : 'chat',
    history:[],
    token : 'TE11EN',
    serverCond : true
};

var theMessage = function(message,userName) {
    return {
        message:text,
        name:userName,
        id: uniqueId()
    };
};
var isRestored = false;
var serverMessagesCount =0;
var ifLogin = false;
var isSelected = 0;
var sizeOfMessage = 0;
var editor = "";
var isFirstLogin = true;
var deletedMessages = [];
var editedMessage;
var historyList = [];
$(document).ready(function() {
    debugger;
    var userName;
    ifLogin = false;
    $('#page1').hide();
    $('#pageForWholeHistory').hide();
    $('#comment').hide();
    $('#submit').hide();
    $('#backToChat').hide();
    $('#mes').hide();
    $('#loginConfirm').hide();

    $('#LOGIN').click(function() {
        if (ifLogin == false) {
            $('.login').addClass('login-edit');
            $('.name').addClass('name-edit');
            $('.name').show();
            $('.login').show();
            $('#loginConfirm').show();
            $('#loginConfirm').click(function() {
                userName = $(".name").val();
           restore();
                $('#loginConfirm').hide();
                $('.name-edit').hide();
                $('.name').hide();
                $('.login').hide();
                $('.login-edit').hide();
                $('#page1').show();
                $('#comment').show();
                $('#submit').show();
                $('#mes').show();
                serverCheck(appState.serverCond);
            });
            ifLogin = true;
        }
    });

    $('#LOGOUT').click(function() {
        if (ifLogin == true) {
            isRestored=false;
            userName = "";
            $('#page1').hide();
            $('#pageForWholeHistory').hide();
            $('#comment').hide();
            $('#submit').hide();
            $('#backToChat').hide();
            $('#mes').hide();
            $('#loginConfirm').hide();
            $('#page1').empty();
            restore();
            ifLogin = false;
        }
    });

    $("#history").click(function() {
        if (ifLogin == true) {
            $('#page1').hide();
            $('#pageForWholeHistory').show();
            $('#backToChat').show();
            $('#comment').hide();
            $('#submit').hide();
            $('#mes').hide();
            $('#loginConfirm').hide();
        }
    });

    $("#backToChat").click(function() {
        $('#page1').show();
        $('#pageForWholeHistory').hide();
        $('#backToChat').hide();
        $('#comment').show();
        $('#submit').show();
        $('#mes').show();
    });

    var crtMessage = function(user,msg, done, value) {
        return {
            name: user,
            message: msg,
            status: done,
            id: value
        }
    };

    $("#submit").click(function() {
        var msg = $('#comment').val();
        if(msg.length>0)
        {
            messageDiv = crtMessage(userName,msg, 'usual', uniqueID());
            sendMessage(messageDiv, function() {
                console.log('Message sent ' + messageDiv.message);
            });
            $('#comment').val('');
        }
    });


    function sendMessage(message, continueWith) {
        post(appState.mainUrl, JSON.stringify(message), function(){
            continueWith && continueWith();
        });
    }

    function updateHistory(newMessages) {
        for(var i = 0; i < newMessages.length; i++)
            addMessageInternal(newMessages[i]);
    }

    function addMessageInternal(singleMessage) {
        var historyBox = document.getElementById('pageForWholeHistory');
        var history = appState.history;
        history.push(singleMessage);
        if (singleMessage.message > 0) {
            historyBox.innerText = singleMessage.name + ': ' + singleMessage.message + '\n\n' + historyBox.innerText;
            if (userName == singleMessage.name)
                $("#page1").append('<div status="usual" class="message" message-id =' + singleMessage.id + '>' + ' <b>' + singleMessage.name + '</b>' + " : " + '<input type = "text" id="editMes">' + '<button class="buttons" id="editMessage">Edit</button>' + '<img id="editing" title="Edit this message" src="resources/images/edit.png">' + '<br>' + '<span id=MSG>' + singleMessage.message + '</span>' + '</div>');
            else
                $("#page1").append('<div status="usual" class="message" message-id =' + singleMessage.id + '>' + ' <b>' + singleMessage.name + '</b>' + " : " + '<br>' + '<span id=MSG>' + singleMessage.message + '</span>' + '</div>');
        }
    }




    function restore() {
        var url = appState.mainUrl + '?token=' + 'TE11EN';
        get(url, function(responseText) {
            var response = JSON.parse(responseText);
            var appendLength = 0;

            if(serverMessagesCount!=response.messages.length)
            {
                appendLength = Math.abs(serverMessagesCount-response.messages.length);

            }
            serverMessagesCount=response.messages.length;
            var historyLength = 0;
            for(var i = 0;i<response.messages.length;i++)
            {
                if(response.messages[i].message.length>0) {
                    appState.history[historyLength] = response.messages[i];
                    historyLength++;
                }

            }
            var historyBox = document.getElementById('pageForWholeHistory');
            historyBox.innerText ='';
            for(var i = 0; i< historyLength; i++) {
                historyBox.innerText = appState.history[i].name + ': ' + appState.history[i].message + '\n\n' + historyBox.innerText;
                if (historyLength == $('#page1').children().size()) {
                for (var j = 0; j < historyLength; j++) {
                    if ($('#page1').children()[j].getAttribute("message-id") == appState.history[i].id && $('#page1').children()[j].getElementsByTagName('span')[0].textContent != appState.history[i].message) {
                        $('#page1').children()[j].getElementsByTagName('span')[0].textContent = appState.history[i].message;
                    }
                }
            }
            }
            if(isRestored == false)
            {
                appendLength = historyLength;
            }
                    for (var i = 0; i < appendLength; i++) {
                        if (userName == appState.history[historyLength - 1 - i].name)
                            $("#page1").append('<div status="usual" class="message" message-id =' + appState.history[historyLength - 1 - i].id + '>' + ' <b>' + appState.history[historyLength - 1 - i].name + '</b>' + " : " + '<input type = "text" id="editMes">' + '<button class="buttons" id="editMessage">Edit</button>' + '<img id="editing" title="Edit this message" src="resources/images/edit.png">' + '<br>' + '<span id=MSG>' + appState.history[historyLength - 1 - i].message + '</span>' + '</div>');
                        else
                            $("#page1").append('<div status="usual" class="message" message-id =' + appState.history[historyLength - 1 - i].id + '>' + ' <b>' + appState.history[historyLength - 1 - i].name + '</b>' + " : " + '<br>' + '<span id=MSG>' + appState.history[historyLength - 1 - i].message + '</span>' + '</div>');

                    }

            isRestored = true;
        }, function(error) {
            defaultErrorHandler(error);
        });
    }

    function serverCheck(flag){
        if (flag){
            document.getElementById("serverOn").style.visibility = "visible";
            document.getElementById("serverOff").style.visibility = "hidden";
        }
        else{
            document.getElementById("serverOn").style.visibility = "hidden";
            document.getElementById("serverOff").style.visibility = "visible";
        }
    }

    function removeMsg(id){
        del(appState.mainUrl, JSON.stringify({id: id}), function(){
            console.log("DELETE successful");
        },function(error) {
            defaultErrorHandler(error);
        });
    }

    function sendEditedMsg(value, id,status1){
        var obj = {
            id: id,
            message: value,
            status: status1
        };
        put(appState.mainUrl, JSON.stringify(obj), function(responseText){
            console.log("PUT successful");
        });
    }

    function defaultErrorHandler(message) {
        var historyBox = document.getElementById('pageForWholeHistory');
        appState.serverCond = false;
        serverCheck(appState.serverCond);
        console.error(message);
        historyBox.innerText = 'ERROR:\n' + message + '\n';
    }

    function get(url, continueWith, continueWithError) {
        ajax('GET', url, null, continueWith, continueWithError);
    }

    function post(url, data, continueWith, continueWithError) {
        ajax('POST', url, data, continueWith, continueWithError);
    }

    function put(url, data, continueWith, continueWithError) {
        ajax('PUT', url, data, continueWith, continueWithError);
    }

    function del(url, data, continueWith, continueWithError){
        ajax('DELETE', url, data, continueWith, continueWithError);
    }

    function isError(text) {
        if(text == "")
            return false;
        try {
            var obj = JSON.parse(text);
        } catch(ex) {
            appState.serverCond = false;
            serverCheck(appState.serverCond);
            return true;
        }
        return !!obj.error;
    }

    function ajax(method, url, data, continueWith, continueWithError) {
        var xhr = new XMLHttpRequest();
        continueWithError = continueWithError || defaultErrorHandler;
        xhr.open(method || 'GET', url, true);
        xhr.onload = function () {
            if (xhr.readyState !== 4)
                return;
            if(xhr.status != 200) {
                continueWithError('Error on the server side, response ' + xhr.status);
                return;
            }
            if(isError(xhr.responseText)) {
                appState.serverCond = false;
                serverCheck(appState.serverCond);
                continueWithError('Error on the server side, response ' + xhr.responseText);
                return;
            }
            continueWith(xhr.responseText);
            setTimeout(function(){restore();}, 1000);
            if( isFirstLogin==true)
            {
                isFirstLogin=false;
            }
        };

        xhr.ontimeout = function () {
            continueWithError('Server timed out !');
        }

        xhr.onerror = function (e) {
            appState.serverCond = false;
            serverCheck(appState.serverCond);
            var errMsg = 'Server connection error ' + appState.mainUrl + '\n'+
                '\n' +
                'Check if \n'+
                '- server is active\n'+
                '- server sends header "Access-Control-Allow-Origin:*"';

            continueWithError(errMsg);
        };
        xhr.send(data);
    }

    window.onerror = function(err) {
        defaultErrorHandler(err.toString());
    }

    var makeUnselected = function() {
        if (isSelected != 0) {
            $('.selected').removeClass('selected');
            isSelected = 0;
        }
    };

    $(document).on('click', '.message', function() {
        $(this).toggleClass('selected');
        makeUnselected();
    });

    $('#deletion').click(function() {
        var counter = 0;
        for (var i = 0; i < $('.selected').size(); i++) {
            if($('.selected')[i].childNodes[1].textContent!=userName) {
                counter = counter + 1;
            }
        }
        if(counter==0) {
            for (var i = 0; i < $('.selected').size(); i++) {
                if ($('.selected')[i].childNodes[1].textContent == userName) {
                    $('.selected')[i].setAttribute("status", "false");
                    msg = $('.selected')[i]["lastChild"]["lastChild"];
                    uniqueId = $('.selected')[i].getAttribute("message-id");
                    messageDiv = crtMessage(userName, msg, 'deleted', uniqueId);
                    removeMsg(uniqueId);
                    deletedMessages.push(messageDiv);
                }
            }
            $('.selected').remove();
        }
    });

    $("#page1").on("click", "#editing", function() {
        isSelected = 1;
        $(this).parent().children("#editing").hide();
        $(this).parent().children("#editMessage").show();
        $(this).parent().children("#editMes").show();
        editor = $(this).parent().children("#MSG").html();
        $(this).parent().children("#MSG").hide();
        $(this).parent().children("#editMes").val(editor);
        $(this).parent().removeClass('selected');
        $('.selected').removeClass('selected');
    });

    $('#page1').on("click", "button#editMessage", function() {
        $(this).parent().children("#editing").show();
        text = $(this).parent().children('#editMes').val();
        $(this).parent().attr("status","edited");
        sendEditedMsg(text,  $(this).parent().attr("message-id"),$(this).parent().attr("status"));

        $(this).parent().children('#MSG').html(text);
        $(this).parent().children("#editMessage").hide();
        $(this).parent().children("#editMes").hide();
        $(this).parent().children("#MSG").show();
        $('.selected').removeClass('selected');
        $(this).parent().removeClass('selected');
        isSelected = 1;
    });

});