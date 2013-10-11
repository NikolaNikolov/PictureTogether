(function (global) {
    function getJSON(url, success, error) {
        $.ajax({
            url: url,
            type: "get",
            contentType: "application/json",
            success: success,
            error: error
        });
    }

    function postJSON(url, data, success, error) {
        $.ajax({
            url: url,
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: success,
            error: error
        });
    }

    function putJSON(url, data, success, error) {
        $.ajax({
            url: url,
            type: "put",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: success,
            error: error
        });
    }

    global.httpRequester = {
        getJSON: getJSON,
        postJSON: postJSON,
        putJSON: putJSON
    };
})(window);
