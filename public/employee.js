function populate(user) {
	$('#userID').val(user.userID);
	$('#firstName').val(user.firstName);
	$('#lastName').val(user.lastName);
	if (user.locked == 'true') {
		$('#locked').attr('checked', true);
	}
}

function employeeScreen(user) {

	// set the page title

	populate(user);

	$('#deleteBtn')
		.click(
				function() {
					if (confirm("Are you sure that you want to delete this employee’s account?")) {
						$.ajax({
							url : 'http://api.ordrupapp.com/users/' + $('#userID').val(),
							type : 'DELETE',
							data : '',
							success : function() {
								alert('success');
							}
						});
					}
				});

	$('#updateBtn').click(function() {
		$.ajax({
			url : 'http://api.ordrupapp.com/users/5',
			type : 'PUT',
			data : $('.employeeInfo').serialize(),
			success : function() {
				alert('success');
			}
		});
	});

}