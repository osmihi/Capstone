var userInfo;
var selectedParty;

RequestType = {
	CREATE : "POST",
	READ : "GET",
	UPDATE : "PUT",
	DELETE : "DELETE",
	POST : "POST",
	GET  : "GET",
	PUT : "PUT"
}

function request(resource, key, rqType, userInfoString, dataString,
		successFunc, errorFunc) {
	if (key == null)
		key = "";

	$.ajax({
		url : "http://api.ordrupapp.com/" + resource + "/" + key,
		type : rqType,
		data : userInfoString + "&" + dataString,
		error : function(response, textStatus, errorThrown) {
			errorFunc(response, textStatus, errorThrown);
		},
		success : function(response) {
			successFunc(response);
		}
	});
}
