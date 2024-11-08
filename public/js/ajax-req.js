const { response } = require("../..");


jQuery(document).ready(function($){



    $("#chat_signup").submit( async function(e) {
        e.preventDefault();
        // Get form field values
        const first_name = $("#first_name").val().trim();
        const last_name = $("#last_name").val().trim();
        const emp_email = $("#email").val().trim();
        const emp_password = $("#emp_password").val().trim();
        const emp_profile_pic = $("#emp_profile_pic")[0].files[0];
        const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        $('.error').remove();
        var error = 0;
        $( "#chat_signup .required" ).each(function( index ) {
            if(!$(this).val().trim()) {
                var label = $(this).closest('.form-group').find('label').text();
                $(this).after('<span class="error">'+ label +' is required!</span>');
                error++;
                return;
            }
        });
        
        if(emp_email != '' && !email_regex.test(emp_email)) {
            $('#email').after('<span class="error">Please enter valid email address!</span>');
            return;
        }
        if (emp_password != '' && !regex.test(emp_password)) {
            $('#emp_password').after('<span class="error">Password must be 8-16 characters, with at least one uppercase letter, one lowercase letter, one digit, and one special character (e.g., @, $, !, %, *, ?, &).</span>');
            return;
        }
        // if (!emp_profile_pic) {
        //     $('#emp_profile_pic').after('<span class="error">Please upload profile pic!</span>');
        //     return;
        // }        
        // If validation passes, create a FormData object to handle file upload
        const formm = document.getElementById('chat_signup');
        const formData = new FormData(formm);
        
        // formData.append("first_name", first_name);
        // formData.append("last_name", last_name);
        // formData.append("emp_email", emp_email);
        // formData.append("emp_password", emp_password);
        // formData.append("emp_profile_pic", emp_profile_pic);
        

        
        

        try {
            const result = await fetch('/signup-callback', {
                method: 'POST',                
                body: formData,
            });
        
            // Check if response is okay
            if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
            } else {
                            // Parse the response
                const respnse = await result.json();
                if(response.status == 'success') {
                    console.log("Response Data:", respnse);
                } else {
                                        
                }
                

            }
        
        } catch (error) {
            console.error("Error:", error);
        }
        // AJAX request        
        // $.ajax({
        //     url: '/signup-callback',
        //     type: 'POST',
        //     data: alldata,
        //     cache: false,
            
        //     success: function (data){
        //         console.log('Form submitted successfully');
        //     },
        //     error: function (data,errorThrown) {
        //         console.log(errorThrown);
        //     }
        //   });
    });
});