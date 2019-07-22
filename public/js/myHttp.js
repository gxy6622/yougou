function  myHttp(options) {
        options.dataType = 'json';
        var success = options.success;
        options.success = function(result) {
          if(result.message !== '') alert(result.message);
          switch(result.status) {
                  case 200:
                          success(result.data);
                          break;
                  case 401:
                          Cookies.set('target', window.location.href);
                          window.location.href = 'login.html';
                          break;
                  default:
                          break;
          }
        };
	$.ajax(options);
}