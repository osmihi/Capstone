<!DOCTYPE html>

<html>
	<head>
		<title>OrDrUp API Tester</title>

		<script src="scripts/jquery-1.10.1.min.js" type="text/javascript"></script>
		
		<script type="text/javascript">

			function drop(elementId) {
				$('#' + elementId + 'Row').remove();
			}

			$(function() {
				
				$('#paramName').keyup(function() {
					$('#paramName').val( $('#paramName').val().replace(/\W/g, '') );
				});
				
				$('#addParam').click(function() {
					var pName = $('#paramName').val();
					if ( pName != "" ) {
						var toAdd = '<tr id="' + pName + 'Row">';
						toAdd += '<td><input type="button" value="X" onClick="drop(\'' + pName + '\');"/></td>';
						toAdd += '<td><label for="' + pName + '"/>' + pName + ': </label></td>';
						toAdd += '<td><input id="' + pName + '" name="' + pName + '" type="text" class="parameter"/></td>';
						toAdd += '</tr><br />';
						$('#addedParams').append(toAdd);
					}

					$('#paramName').val('');
				});
				
				$('#submit').click(function() {
					var paramFields = $('.param[value != ""]');
					var params = "";
					var i = 0;
					
					while ( i < paramFields.size() ) {
						params += paramFields.get(i++).value + "=" + paramFields.get(i++) + "&";
					}

					$.ajax({
						url:"http://api.ordrupapp.com/" + $('#resource').val().toLowerCase() + "/" + $('#key').val(),
						type:$('input:radio[name=rqType]:checked').val(),
					    data: $('.parameter[value!=""]').serialize(),
    					//contentType: "application/json; charset=utf-8",
    					//dataType: "jsonp",
					    error: function () {
					      $('#apiResult').append('<p>Error</p>');
					    },
					    success: function () {
					    	$('#apiResult').append('<p>Success</p>');
					    }
					});
				});	
			});
		</script>
		
	</head>

	<body>
		<div id="page">

			<h3>API Tester</h3>

			<form id="apiTest">
				<label for="resource">Resource: </label>	
				<input id="resource" type="text" name="resource"/>
				<label for="key">Key: </label>
				<input id="key" type="number" name="key"/><br />
				
				<input id="rqGet" type="radio" name="rqType" value="GET"/>
				<label for="rqGet">GET (Read)</label>
				<input id="rqPost" type="radio" name="rqType" value="POST"/>
				<label for="rqPost">POST (Create)</label>
				<input id="rqPut" type="radio" name="rqType" value="PUT"/>
				<label for="rqPut">PUT (Update)</label>
				<input id="rqDelete" type="radio" name="rqType" value="DELETE"/>
				<label for="rqDelete">DELETE (Delete)</label><br /><br />

				<input id="submit" type="button" value="Submit Request"/><br /><br />

				<h4>Additional Parameters:</h4>

				<input id="paramName" type="text" name="paramName"/>
				<input id="addParam" type="button" name="addParam" value="Add Param"/><br /><br />
				
				<div>
					<pre>
						<table id="addedParams"></table>
					</pre>
				</div>

			</form> 

			<div id="apiResult"></div>

		</div> <!-- page -->
	</body>

</html>
