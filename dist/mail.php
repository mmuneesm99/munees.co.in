<?php

// Enable error reporting for debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect form data
    $project_name = trim($_POST['project_name']);
    $admin_email = trim($_POST['admin_email']);
    $form_subject = trim($_POST['form_subject']);
    $name = trim($_POST['Name']);
    $company = trim($_POST['Company']);
    $email = trim($_POST['E-mail']);
    $phone = trim($_POST['Phone']);
    $message_content = trim($_POST['Message']);
    
    // Check for required fields
    if (empty($name) || empty($email) || empty($phone) || empty($message_content)) {
        echo 'All fields are required.';
        exit;
    }

    // Build the email message
    $message = "
    <html>
    <body>
    <h2>Contact Form Submission</h2>
    <table>
        <tr>
            <th>Field</th>
            <th>Details</th>
        </tr>
        <tr>
            <td><strong>Name:</strong></td>
            <td>{$name}</td>
        </tr>
        <tr>
            <td><strong>Company:</strong></td>
            <td>{$company}</td>
        </tr>
        <tr>
            <td><strong>Email:</strong></td>
            <td>{$email}</td>
        </tr>
        <tr>
            <td><strong>Phone:</strong></td>
            <td>{$phone}</td>
        </tr>
        <tr>
            <td><strong>Message:</strong></td>
            <td>{$message_content}</td>
        </tr>
    </table>
    </body>
    </html>
    ";

    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: {$name} <{$email}>" . "\r\n";
    $headers .= "Reply-To: {$email}" . "\r\n";

    // Send the email
    if (mail($admin_email, $form_subject, $message, $headers)) {
        echo 'Message sent successfully.';
    } else {
        echo 'Message could not be sent. Please try again later.';
    }
} else {
    echo 'Invalid request.';
}

?>
