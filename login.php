<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
    session_start();
    include("db.php");

    if($_SERVER['REQUEST_METHOD']== "POST" && isset($_POST['Register']))
    {
        $full_name = $_POST['Name'];
        $Dob = $_POST['DOB'];
        $email = $_POST['Email'];
        $address = $_POST['Address'];
        $user_name = $_POST['Username'];
        $password =$_POST['Password'];

        if (!empty($email) && !empty($password) && !is_numeric($email)) {
            
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $con->prepare("INSERT INTO custumers (Name, Email, DOB, Address, Username, Password) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $full_name, $email, $Dob, $address, $user_name, $password);
        
            if ($stmt->execute()) {
                echo "<script type='text/javascript'> alert('Successfully Registered');</script>";
            } else {
                echo "<script type='text/javascript'> alert('Error during registration');</script>";
            }
        
            $stmt->close();
        } else {
            echo "<script type='text/javascript'> alert('Please Enter some Valid Information');</script>";
        }
        
    }

    // Login logic
if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['Login'])) {
    $user_name = $_POST['Username'];
    $password = $_POST['Password'];

    if (!empty($user_name) && !empty($password)) {
        // Prepare the SQL query to fetch the user based on the username
        $stmt = $con->prepare("SELECT * FROM custumers WHERE Username = ? LIMIT 1");
        $stmt->bind_param("s", $user_name);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // If user exists and password matches
        if ($user && password_verify($password, $user['Password'])) {
            // Set session variables for the logged-in user
            $_SESSION['user_id'] = $user['custumer_ID'];
            $_SESSION['user_name'] = $user['Username']; // Store the username or other data

            // Redirect to a dashboard or home page (for example)
            echo "<script>alert('Login Successful! Redirecting...');</script>";
            header("Location: home-page.php"); // Replace with your dashboard page
            exit();
        } else {
            // Incorrect credentials
            echo "<script type='text/javascript'> alert('Invalid Username or Password');</script>";
        }

        $stmt->close();
    } else {
        echo "<script type='text/javascript'> alert('Please enter both username and password');</script>";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div id="header">
        <div id="title">
            <h1>Company Name</h1>
        </div>
        
        <div id="nav-bar">
            <ul>
                <li><a href="#about-us">About Us</a></li>
                <li><a href="#services">Services</a></li>
            </ul>
        </div>
        
        <div id="search-bar">
        <form action="/search" method="get">
            <input type="text" placeholder="search" name="q">
        </form>
    </div>
 <!-- Dynamically Render Buttons -->
 <?php if (isset($_SESSION['user_name'])): ?>
            <button class="btnLogin-popup logout-button" style="margin:2px;" onclick="window.location.href='logout.php'">Logout</button>
            <div id="account">
                <p>
                    <a href="account-settings.html" id="displayUsername"><?= htmlspecialchars($_SESSION['user_name']) ?></a>
                </p>
            </div>
        <?php else: ?>
            <button class="btnLogin-popup login-button" onclick="window.location.href='login.html'">Login</button>
            <div id="account">
                
            </div>
        <?php endif; ?>
    </div>
    
        
        
        <div id ="content"></div>
        <div id ="footer"></div>
    
    <div class="wrapper">
                <div class="form-box login">
                    <h2>Login</h2>
                    <form method = "POST">
                    <div class="input-box">
                        <input type="text" placeholder="Username"   required>
                        <i class="bx bxs-user"></i>
                    </div>
                    <div class="input-box">
                        <input type="password" placeholder="Password"required>
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                    <div class="remember-forgot">
                        <label><input type ="checkbox"> Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn">Login</button><br>
                    
                    <div class= "login-register">
                        <p>Don't have an account? <a href="#" class="register-link">Register</a> </p>
                    </div>
                </form>
            </div>

            <div class="form-box register">
                <h1>Registration</h1>
                <form method="POST">
                <div class="input-box">
                    <input type="text" placeholder="Full name" name="Name" required>
                </div> 
                <div class="input-box">
                    <input type="date" placeholder="Birthdate" name="DOB" required>
                </div> 
               <div class="input-box">
                    <input type="email" placeholder="Email" name="Email" required>
                    <i class='bx bx-envelope'></i>
                </div> 
                <div class="input-box">
                    <input type="text" placeholder="Address" name="Address" required>
                </div> 
                <div class="input-box">
                    <input type="text" placeholder="Username" name="Username" required>
                    <i class="bx bxs-user"></i>
                </div>
                <div class="input-box">
                    <input type="password" placeholder="Password" name="Password" required>
                    <i class='bx bxs-lock-alt'></i>
                </div>
                <div class="input-box">
                    <input type="password" placeholder="Confirm Password" required>
                    <i class='bx bxs-lock-alt'></i>
                </div>
                <div class="terms-conditions">
                    <label><input type ="checkbox"> I agree to terms & conditions</label> 
                </div>
                <button type="submit" class="btn">Register</button>
                <div class= "register-link"> 

                </div>
            </form>
        </div>
    
    </div>
    
    <script src="script.js"></script>
</body>
</html>
