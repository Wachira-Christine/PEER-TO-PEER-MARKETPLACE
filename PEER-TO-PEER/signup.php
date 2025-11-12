<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'connection.php'; // database connection

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); 

    // Check if email already exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "<script>alert('Email already registered! Try another.');</script>";
    } else {
        $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $name, $email, $password);

        if ($stmt->execute()) {
            // Send welcome email
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'crystalkimalel@gmail.com';   
                $mail->Password   = 'lynf lzox ifwa rtpz';        // Gmail App password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $mail->Port       = 465;

                $mail->setFrom('crystalkimalel@gmail.com', 'Crystal');
                $mail->addAddress($email, $name); 

                $mail->isHTML(true);
                $mail->Subject = "Welcome, $name!";
                $mail->Body    = "
                    <p>Hello <b>$name</b>,</p>
                    <p>Your request for an account has been accepted! You can now log in to your account:</p>
                    <p><a href='http://localhost/IAP-Group%20B02/signin.php'>Click here to Login</a></p>
                    <br>
                    <p>Regards,<br>Crystal</p>
                ";
                $mail->AltBody = "Hello $name,\n\nThanks for signing up! Login here: http://localhost/IAP-Group%20B02/signin.php";

                $mail->send();
                echo "<script>alert('Signup successful! A verification email has been sent.');</script>";
            } catch (Exception $e) {
                echo "<script>alert('Signup successful, but email could not be sent. Error: {$mail->ErrorInfo}');</script>";
            }
        } else {
            echo "<script>alert('Error: Could not register.');</script>";
        }
    }
}
?>






<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register Page</title>
    <link rel="stylesheet" href="style3.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div class="wrapper">
        <form method="POST" action="">
            <h1>Register</h1>
            <div class="input-box">
                <input type="text" name="name" placeholder="Enter your name" required>
                <i class='bx bxs-user'></i>
            </div>
            
            <div class="input-box">
                <input type="email" name="email" placeholder="Enter your email" required>
                <i class='bx bxs-envelope'></i>
            </div>

            <div class="input-box">
                <input type="password" name="password" placeholder="Enter your password" required>
                <i class='bx bxs-lock-alt'></i>
            </div>
        
           
            <button type="submit" class="btn">Register</button>
            


        </form>
    </div>
    
</body>
</html>