<?php
include 'connection.php';

$sql = "SELECT id, name, email FROM users ORDER BY id ASC";
$result = $conn->query($sql);

?>
<!DOCTYPE html>
<html lang="en">
<head>
     <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>Registered Users</title>
<style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 50%; }
        th, td { border: 1px solid #FFB6C1; padding: 8px; text-align: left; }
        th { background-color: #FF1493; }
    </style>
</head>
<body>
    <h1>Registered Users</h1>
    <table>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
        </tr>
        <?php
        $num = 1;
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>
                        <td>{$num}</td>
                        <td>{$row['name']}</td>
                        <td>{$row['email']}</td>
                      </tr>";
                $num++;
            }
        } else {
            echo "<tr><td colspan='3'>No users found</td></tr>";
        }
        ?>
    </table>
</body>
</html>
