<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$name       = trim($input['name'] ?? '');
$email      = trim($input['email'] ?? '');
$phone      = trim($input['phone'] ?? '');
$job_title  = trim($input['job_title'] ?? '');
$cover      = trim($input['cover_letter'] ?? '');
$resume     = trim($input['resume_link'] ?? '');

if (!$name || !$email || !$job_title) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email and job title are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Send email notification via Gmail SMTP using PHPMailer
$autoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($autoload)) {
    require $autoload;
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'sainithin95054@gmail.com';
        $mail->Password   = 'kwgz whhh wosh fzfg';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('sainithin95054@gmail.com', 'Vikrin Careers');
        $mail->addAddress('sainithin95054@gmail.com', 'Vikrin Admin');
        $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = "🎯 New Job Application – $job_title – $name";
        $mail->Body    = "
            <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto'>
                <div style='background:#1F3CAB;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0'>
                    <h2 style='margin:0'>New Job Application Received</h2>
                    <p style='margin:4px 0 0;opacity:.8'>Vikrin Careers Portal</p>
                </div>
                <div style='background:#f9f9f9;padding:24px;border:1px solid #e0e0e0'>
                    <table style='width:100%;border-collapse:collapse'>
                        <tr><td style='padding:8px 0;color:#555;width:140px'><strong>Position</strong></td><td style='padding:8px 0'>$job_title</td></tr>
                        <tr><td style='padding:8px 0;color:#555'><strong>Applicant Name</strong></td><td style='padding:8px 0'>$name</td></tr>
                        <tr><td style='padding:8px 0;color:#555'><strong>Email</strong></td><td style='padding:8px 0'><a href='mailto:$email'>$email</a></td></tr>
                        <tr><td style='padding:8px 0;color:#555'><strong>Phone</strong></td><td style='padding:8px 0'>$phone</td></tr>
                        " . ($resume ? "<tr><td style='padding:8px 0;color:#555'><strong>Resume Link</strong></td><td style='padding:8px 0'><a href='$resume'>$resume</a></td></tr>" : '') . "
                    </table>
                    <hr style='margin:20px 0;border:none;border-top:1px solid #ddd'>
                    <strong>Cover Letter:</strong>
                    <p style='margin-top:8px;line-height:1.6;color:#333'>" . nl2br(htmlspecialchars($cover)) . "</p>
                </div>
                <div style='background:#eef2ff;padding:12px 24px;border-radius:0 0 8px 8px;color:#555;font-size:13px'>
                    This email was sent via the Vikrin website careers portal.
                </div>
            </div>
        ";

        $mail->send();
    } catch (Exception $e) {
        // Email failed but we still accept application – just log it
        error_log("Mailer Error: " . $mail->ErrorInfo);
    }
} else {
    // Fallback to PHP mail() if PHPMailer not installed
    $to = 'sainithin95054@gmail.com';
    $subject = "New Job Application – $job_title – $name";
    $message = "Name: $name\nEmail: $email\nPhone: $phone\nPosition: $job_title\nResume: $resume\n\nCover Letter:\n$cover";
    $headers = "From: noreply@vikrin.com\r\nReply-To: $email";
    mail($to, $subject, $message, $headers);
}

echo json_encode(['success' => true, 'message' => 'Application submitted successfully! We will get back to you soon.']);
