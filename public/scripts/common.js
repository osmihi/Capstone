var userInfo;
var userID;
var userRole;

var restaurant;

var selectedParty = null;
var partyIsSelected = false;
var selectedTable;

var selectedBill = null;

var refreshFunc = function() {};

var RequestType = {
	CREATE : "POST",
	READ : "GET",
	UPDATE : "PUT",
	DELETE : "DELETE",
	POST : "POST",
	GET  : "GET",
	PUT : "PUT"
}

setInterval(function(){
    refreshFunc();
},20000);

function request(resource, key, rqType, userInfoString, dataString, successFunc, errorFunc) {
	if (key == null)
		key = "";

	$.ajax({
		url : "http://api.ordrupapp.com/" + resource + "/" + key,
		type : rqType,
		data : userInfoString + "&" + dataString,
		error : function(response, textStatus, errorThrown) {
			if (typeof errorFunc !== 'undefined') errorFunc(response, textStatus, errorThrown);
		},
		success : function(response) {
			successFunc(response);
		}
	});
}

// Utilities

// http://stackoverflow.com/questions/1960473/unique-values-in-an-array
Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

function money(currency) {
	currency = String(currency);
	return Number(currency.replace(/[^0-9\.]+/g,""));
}