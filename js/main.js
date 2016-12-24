String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var validation = {
    uid: '^\\d{1,5}$',
    name: '[a-z|A-Z|0-9]{2,}',
    date: '.',
    email: '^[a-zA-Z\\-+._]{0,}@\\w+\\.\\w{2,3}$',
    address: /\w+/g,
    valid: function(el) {
        el.classList.remove('error');
        el.classList.add('success');
        return true;
    },
    invalid: function(el){
        el.classList.add('error');
        el.classList.remove('success');
        return false;
    },
};

var myData = {};
    
    
function validate(element){
    var result =  [];
    var fields = element.getElementsByClassName('field');
    var field;
    for(var i = 0; i < fields.length; i++) {
        field = fields[i];
        var method = field.getAttribute('data-validation'), 
            reg = new RegExp(validation[method]);
        
        field.value.match(reg) ? 
            result.push(validation.valid(field)) :
            result.push(validation.invalid(field))

    }
    return result;
}
    
window.onload = function () {
    function sendData(data) {
        var xml = new XMLHttpRequest();
        xml.open('POST', 'http://localhost:3000/api');
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.onreadystatechange = function () {
            if (xml.status == '200' && xml.readyState == '4') renderData();
        }
        xml.send(JSON.stringify(data));
    }

    function updateData(data) {
        var xml = new XMLHttpRequest();
        xml.open('PUT', 'http://localhost:3000/api');
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.onreadystatechange = function () {
            if (xml.status == '200' && xml.readyState == '4') renderData();
        }
        xml.send(JSON.stringify(data));
    }

    function deleteData(data) {
        var xml = new XMLHttpRequest();
        xml.open('DELETE', 'http://localhost:3000/api');
        xml.setRequestHeader('Content-Type', 'application/json');
        xml.onreadystatechange = function () {
            if (xml.status == '200' && xml.readyState == '4') renderData();
        }
        xml.send(JSON.stringify(data));
    }

    function hideModal() {
        var mc = document.getElementsByClassName('modal-container')[0];
        mc.classList.add("hidden");
    }

    function uploadHTML(data) {
        var list = document.getElementById("list");
        list.innerHTML = data.map((user) => {
            var t = "<li>{d}</li>";
            var controlButtons = "<div class=\"controls\">" +
                "<button class='btn btn-edit' type=\"button\">Edit</button>" +
                "<button class='btn btn-delete' type=\"button\">Delete</button>" +
                "</div>";
            return "<li class=\"user-data\" data-uid=\"" + user.id + "\">" +
                controlButtons + "<ul>" +
                t.replace("{d}", "ID: " + user.id) +
                t.replace("{d}", "Name: " + user.name) +
                t.replace("{d}", "Date: " + user.date) +
                t.replace("{d}", "Address: " + user.address) +
                t.replace("{d}", "Email: " + user.email) +
                "</ul></li>"
        }).join('');
        // add event listeners to buttons edit and delete
        //list.children[0].getElementsByClassName("controls")
        var modal = document.getElementsByClassName("modal-container")[0];
        for(var i = 0; i < list.children.length; i++) {
            var edit = list.children[i].getElementsByClassName("btn-edit")[0];
            edit.addEventListener("click", function() {
                var uid = this.parentElement.parentElement.dataset.uid;
                var data = getData(uid);
                if(!!data) {
                    renderEditForm(data);
                    modal.classList.remove("hidden");
                    var editButton = document.getElementById("btn-edit");
                    editButton.addEventListener('click', function () {
                        var result = validate(modal);
                        if(result.indexOf(false) > -1) {
                            console.log("Cannot edit, error in data");
                            console.log(result);
                        } else {
                            var dataNew = {
                                id: data.id,
                                name: document.getElementById("name-edit").value,
                                date: document.getElementById("date-edit").value,
                                address: document.getElementById("address-edit").value,
                                email: document.getElementById("email-edit").value
                            };
                            updateData(dataNew);
                            hideModal();
                        }
                    });
                }
            });
            var del = list.children[i].getElementsByClassName("btn-delete")[0];
            del.addEventListener("click", function() {
                var uid = this.parentElement.parentElement.dataset.uid;
                deleteData({id: uid});
            })
        }
    }

    function getData(uid) {
        for(var i = 0; i < myData.length; i++) {
            if(myData[i].id === uid) {
                return myData[i];
            }
        }
        return false;
    }

    // render edit form in modal window, takes object with data as argument
    function renderEditForm(data) {
        var start = '<div class="form"><div class="header">Edit user</div><ul>'
        var template = '<li><label for="{type}-edit">{type-capitalized}</label>' + 
            '<input type="text" class="field" value="{value}" data-validation="{type}" id="{type}-edit"></li>';
        var end = '</ul><button class="btn btn-l" type="button" id="btn-edit">Edit</button></div>';
        var types = ['name', 'date', 'address', 'email'];
        var result = start;
        for(var i = 0; i < types.length; i++) {
            result += template
                .replaceAll('{type}', types[i])
                .replace('{type-capitalized}', types[i].capitalize())
                .replace('{value}', data[types[i]]);
        }
        result += end;
        var modal = document.getElementsByClassName("modal")[0];
        modal.innerHTML = result;
    }

    function renderData() {
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:3000/api');
        request.send();
        request.onreadystatechange = function () {
            if (request.status == '200' && request.readyState == '4') {
                myData = JSON.parse(request.response);
                uploadHTML(myData);
            }
        };
    };

    var btn = document.getElementById("btn-create");
    btn.addEventListener('click', function () {
        var result = validate(document.getElementById('form-new'));
        if(result.indexOf(false) > -1) {
            console.log("Error in data");
            console.log(result);
        } else {
            var data = {
                id: document.getElementById("uid").value,
                name: document.getElementById("name").value,
                date: document.getElementById("date").value,
                address: document.getElementById("address").value,
                email: document.getElementById("email").value
            }
            console.log(data);
            sendData(data);
        }
    });

    var overlay = document.getElementById('overlay');
    overlay.addEventListener("click",function() {
        hideModal();
    });

    renderData();
};