"use strict";

alert();

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        document.getElementById("stockText").innerHTML =
        xhttp.responseText;
    }
};

xhttp.open("GET", "api/stock", true);
xhttp.send();
