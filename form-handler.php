<?php

if (function_exists('mail')) {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $visitor_email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if (empty($name) || empty($visitor_email) || empty($subject) || empty($message)) {
        exit("Error: All fields are required.");
    }

    $email_from = 'virtualgalapagos@colgate.edu';
    $email_subject = 'New Form Submission';
    $email_body = "User Name: $name\n".
                "User Email: $visitor_email\n".
                "Subject: $subject\n".
                "User Message: $message\n";

    $to = 'virtualgalapagos@colgate.edu';

    $headers = "From: $email_from \r\n";
    $headers .= "Reply-To: $visitor_email \r\n";

    if (mail($to, $email_subject, $email_body, $headers)) {
        header("Location: contact.html");
        exit;
    } else {
        exit("Error: Unable to send the email. " . error_get_last()['message']);
    }
} else {
    exit('The mail() function is not enabled on this server.');
}

?>