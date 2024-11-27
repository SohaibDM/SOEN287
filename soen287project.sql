-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2024 at 04:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `soen287project`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_ID` int(11) NOT NULL,
  `Name` varchar(250) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `DOB` date NOT NULL,
  `Address` varchar(200) NOT NULL,
  `Username` varchar(10) NOT NULL,
  `Password` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_ID`, `Name`, `Email`, `DOB`, `Address`, `Username`, `Password`) VALUES
(5, 'admin', 'admin@gmail.com', '2023-01-19', 'adminamindnafi', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `bought_services`
--

CREATE TABLE `bought_services` (
  `transaction_ID` int(11) NOT NULL,
  `customer_ID` int(11) NOT NULL,
  `service_ID` int(11) NOT NULL,
  `isPaid` tinyint(1) NOT NULL,
  `purchaseDate` date NOT NULL,
  `isExecuted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bought_services`
--

INSERT INTO `bought_services` (`transaction_ID`, `customer_ID`, `service_ID`, `isPaid`, `purchaseDate`, `isExecuted`) VALUES
(1, 5, 16, 1, '2024-11-25', 1),
(2, 7, 16, 1, '2024-11-26', 1),
(3, 5, 17, 1, '2024-11-26', 0),
(4, 8, 16, 1, '2024-11-26', 0),
(5, 5, 18, 1, '2024-11-26', 0),
(7, 5, 16, 1, '2024-11-26', 0),
(8, 5, 16, 1, '2024-11-26', 0);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_ID` int(11) NOT NULL,
  `Name` varchar(250) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `DOB` date NOT NULL,
  `Address` varchar(250) NOT NULL,
  `payment` varchar(20) NOT NULL DEFAULT 'visa',
  `Username` varchar(10) NOT NULL,
  `Password` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_ID`, `Name`, `Email`, `DOB`, `Address`, `payment`, `Username`, `Password`) VALUES
(5, 'john doe', 'john@doe.com', '2023-01-19', '123 rue john', 'visa', 'johnD', 'admin'),
(6, 'cus tomer', 'customer@customer.com', '2023-02-24', 'customer street', 'visa', 'cusT', 'admin'),
(7, 'customer', 'customer@gmail.com', '2023-01-19', 'adddd', 'visa', 'customer', 'admin'),
(8, 'test', 'test@gmail.com', '2023-01-19', 'test test', 'visa', 'test', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `page`
--

CREATE TABLE `page` (
  `ID` int(11) NOT NULL,
  `Image_Path` varchar(255) DEFAULT NULL,
  `Company_Name` varchar(30) DEFAULT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Number` varchar(17) DEFAULT NULL,
  `Desc_Title` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Twitter` varchar(300) DEFAULT NULL,
  `Instagram` varchar(300) DEFAULT NULL,
  `Linkedin` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page`
--

INSERT INTO `page` (`ID`, `Image_Path`, `Company_Name`, `Address`, `Email`, `Number`, `Desc_Title`, `Description`, `Twitter`, `Instagram`, `Linkedin`) VALUES
(0, '/uploads/1732639270831-PFP.png', 'new company', 'bilelbilel', 'bilel@bilel.bilel', '000-000-0000', 'bilel', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\r\nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\r\nAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'https://google.com', 'https://google.com', 'https://google.com');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_ID` int(11) NOT NULL,
  `Title` varchar(20) NOT NULL,
  `Category` varchar(20) NOT NULL,
  `Price` int(11) NOT NULL,
  `originalPrice` int(11) NOT NULL,
  `Availability` int(11) NOT NULL,
  `description` text NOT NULL,
  `Image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_ID`, `Title`, `Category`, `Price`, `originalPrice`, `Availability`, `description`, `Image`) VALUES
(16, 'edit', 'edit', 45, 54, 0, 'EDIT\nEDIT\nEDIT\nEDIT', '/serviceImages/1732639296060-PFP.png'),
(17, 'des new', 'de', 67, 76, 74, 'bfffffffffffffffffffffffffffffffffffffff\r\nf\r\n\r\nffffffffffffffffffffffffffffffffffffffff', '/serviceImages/1732387666622-PFP.png'),
(18, 'try again', 'new', 34, 56, 0, 'new service description try out hopefully this works\r\nnew service description try out hopefully this works\r\nnew service description try out hopefully this works\r\nnew service description try out hopefully this works\r\n\r\n', '/serviceImages/1732400171036-PFP.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_ID`);

--
-- Indexes for table `bought_services`
--
ALTER TABLE `bought_services`
  ADD PRIMARY KEY (`transaction_ID`),
  ADD KEY `customer_ID` (`customer_ID`),
  ADD KEY `service_ID` (`service_ID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_ID`);

--
-- Indexes for table `page`
--
ALTER TABLE `page`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `bought_services`
--
ALTER TABLE `bought_services`
  MODIFY `transaction_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bought_services`
--
ALTER TABLE `bought_services`
  ADD CONSTRAINT `bought_services_ibfk_1` FOREIGN KEY (`customer_ID`) REFERENCES `customers` (`customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bought_services_ibfk_2` FOREIGN KEY (`service_ID`) REFERENCES `services` (`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
