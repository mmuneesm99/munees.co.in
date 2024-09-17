<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Enable error reporting for debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $project_name = trim($_POST['project_name']);
    $admin_email = trim($_POST['admin_email']);
    $form_subject = trim($_POST['form_subject']);
    $name = trim($_POST['Name']);
    $company = trim($_POST['Company']);
    $email = trim($_POST['E-mail']);
    $phone = trim($_POST['Phone']);
    $message_content = trim($_POST['Message']);
	echo $message_content;
    if (empty($name) || empty($email) || empty($phone) || empty($message_content)) {
        echo 'All fields are required.';
        exit;
    }

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

    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();                                          // Send using SMTP
        $mail->Host       = 'muneemmm.gmail.com';                   // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                 // Enable SMTP authentication
        $mail->Username   = 'muneesmmm@gmail.com';             // SMTP username
        $mail->Password   = 'gmkbzktxgtetpcec';                // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted
        $mail->Port       = 587;                                  // TCP port to connect to

        // Recipients
        $mail->setFrom($email, $name);
        $mail->addAddress($admin_email);

        // Content
        $mail->isHTML(true);                                      // Set email format to HTML
        $mail->Subject = $form_subject;
        $mail->Body    = $message;

        $mail->send();
        echo 'Message sent successfully.';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo 'Invalid request.';
}
?>
