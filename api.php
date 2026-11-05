<?php
// Set headers for CORS and JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// ─── Diagnostics Endpoint ─────────────────────────────────────────────────────
// Visit: yoursite.com/api.php?action=diagnose  to check server health
$action = $_GET['action'] ?? '';

if ($action === 'diagnose') {
    $dbFile = __DIR__ . '/database.sqlite';
    $info = [
        'php_version'        => PHP_VERSION,
        'pdo_available'      => extension_loaded('PDO'),
        'pdo_sqlite_available' => extension_loaded('pdo_sqlite'),
        'db_file_path'       => $dbFile,
        'db_file_exists'     => file_exists($dbFile),
        'db_dir_writable'    => is_writable(__DIR__),
        'db_file_writable'   => file_exists($dbFile) ? is_writable($dbFile) : 'N/A (file not created yet)',
        'server_software'    => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    ];
    echo json_encode($info, JSON_PRETTY_PRINT);
    exit;
}

// ─── Database Connection ──────────────────────────────────────────────────────
$dbFile = __DIR__ . '/database.sqlite';

// Check if directory is writable before connecting
if (!is_writable(__DIR__)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Server directory is not writable. Please set folder permission to 755 on Hostinger File Manager.',
        'path'  => __DIR__
    ]);
    exit;
}

try {
    $pdo = new PDO('sqlite:' . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create the key-value store table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS store (
        key TEXT PRIMARY KEY,
        value TEXT
    )");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => 'Database connection failed. Make sure pdo_sqlite is enabled in PHP settings on Hostinger.',
        'details' => $e->getMessage(),
        'db_path' => $dbFile
    ]);
    exit;
}

// ─── Helper: Get all headers robustly ────────────────────────────────────────
function get_all_headers_robust() {
    $headers = [];
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $name => $val) {
            $headers[strtolower($name)] = $val;
        }
    }
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) === 'HTTP_') {
            $headerName = strtolower(str_replace('_', '-', substr($name, 5)));
            $headers[$headerName] = $value;
        }
    }
    return $headers;
}

// ─── GET: Fetch Settings ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'get') {
    $key = $_GET['key'] ?? '';
    if (!$key) {
        http_response_code(400);
        echo json_encode(['error' => 'Key is required']);
        exit;
    }
    
    $stmt = $pdo->prepare("SELECT value FROM store WHERE key = :key");
    $stmt->execute([':key' => $key]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row) {
        // Return raw JSON value (not double-encoded)
        echo $row['value'];
    } else {
        echo json_encode(null);
    }
}

// ─── POST: Login ──────────────────────────────────────────────────────────────
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $pass  = $data['password'] ?? '';
    
    // Admin Credentials
    if (($email === 'admin@wanderlust.com' || $email === 'admin@wanderlusttravels.com') && $pass === 'admin@123') {
        $token = bin2hex(random_bytes(32));
        
        try {
            $stmt = $pdo->prepare("INSERT INTO store (key, value) VALUES ('admin_session_token', :token)
                                   ON CONFLICT(key) DO UPDATE SET value = excluded.value");
            $stmt->execute([':token' => $token]);
            echo json_encode(['success' => true, 'token' => $token]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error'   => 'Failed to save login token. Check database file/folder write permissions on Hostinger.',
                'details' => $e->getMessage()
            ]);
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
    }
}

// ─── POST: Save Settings ──────────────────────────────────────────────────────
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'set') {
    // Validate Authorization token
    $headers     = get_all_headers_robust();
    $clientToken = '';
    if (isset($headers['x-admin-token'])) {
        $clientToken = $headers['x-admin-token'];
    } elseif (isset($headers['authorization'])) {
        $clientToken = str_replace('Bearer ', '', $headers['authorization']);
    }

    $stmt        = $pdo->query("SELECT value FROM store WHERE key = 'admin_session_token'");
    $serverToken = $stmt->fetchColumn();

    if (!$serverToken || $clientToken !== $serverToken) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized. Token invalid or session expired. Please login again.']);
        exit;
    }

    $key = $_GET['key'] ?? '';
    if (!$key) {
        http_response_code(400);
        echo json_encode(['error' => 'Key is required']);
        exit;
    }
    
    $value = file_get_contents('php://input');
    
    // Basic JSON validation
    json_decode($value);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body sent.', 'json_error' => json_last_error_msg()]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO store (key, value) VALUES (:key, :value)
                               ON CONFLICT(key) DO UPDATE SET value = excluded.value");
        $success = $stmt->execute([':key' => $key, ':value' => $value]);
        
        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Settings saved successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save data to database.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error'   => 'Database write error. Check write permissions of database.sqlite and its folder.',
            'details' => $e->getMessage()
        ]);
    }
}

// ─── POST: Upload Image File ──────────────────────────────────────────────────
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'upload') {

    // Validate token
    $headers     = get_all_headers_robust();
    $clientToken = $headers['x-admin-token'] ?? str_replace('Bearer ', '', $headers['authorization'] ?? '');
    $stmt        = $pdo->query("SELECT value FROM store WHERE key = 'admin_session_token'");
    $serverToken = $stmt->fetchColumn();

    if (!$serverToken || $clientToken !== $serverToken) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized. Please login again.']);
        exit;
    }

    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or upload error: ' . ($_FILES['photo']['error'] ?? 'no file')]);
        exit;
    }

    $file     = $_FILES['photo'];
    $maxSize  = 8 * 1024 * 1024; // 8MB
    $allowed  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    // Validate size
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Max 8MB allowed.']);
        exit;
    }

    // Validate MIME type
    $finfo    = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowed)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, WEBP, GIF allowed.']);
        exit;
    }

    // Create uploads directory if it doesn't exist
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate unique filename
    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
    $fileName = 'gallery_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $destPath = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save uploaded file. Check uploads/ folder permissions.']);
        exit;
    }

    // Build public URL
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host     = $_SERVER['HTTP_HOST'];
    $baseUrl  = $protocol . '://' . $host;
    $fileUrl  = $baseUrl . '/uploads/' . $fileName;

    echo json_encode(['success' => true, 'url' => $fileUrl, 'filename' => $fileName]);

}
// ─── POST: Save Public Form Data (Enquiries — no token required) ─────────────
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'set_public') {
    $allowedPublicKeys = ['rr_enquiries'];
    $key = $_GET['key'] ?? '';

    if (!in_array($key, $allowedPublicKeys)) {
        http_response_code(403);
        echo json_encode(['error' => 'This key is not allowed for public writes.']);
        exit;
    }

    $value = file_get_contents('php://input');
    json_decode($value);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO store (key, value) VALUES (:key, :value)
                               ON CONFLICT(key) DO UPDATE SET value = excluded.value");
        $stmt->execute([':key' => $key, ':value' => $value]);
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database write error.', 'details' => $e->getMessage()]);
    }
}
else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action or method. Valid actions: get, set, login, upload, diagnose']);
}
?>
