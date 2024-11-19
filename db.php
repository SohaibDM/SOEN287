<?php
    $con = mysqli_connect("localhost", "root", "", "soen287project") or die(mysqli_connect_error());
    if (!$con) {
        die("Database connection failed: " . mysqli_connect_error());
    }
?> 