-- Delete existing data
DELETE FROM `Discounted`;
DELETE FROM `Discount`;
DELETE FROM `Tip`;
DELETE FROM `OrderItem`;
DELETE FROM `Order`;
DELETE FROM `MenuItem`;
DELETE FROM `WaitList`;
DELETE FROM `Table`;
DELETE FROM `User`;
DELETE FROM `Restaurant`;

-- Restaurants
INSERT INTO `Restaurant` (`Name`) VALUES ('BurgerJoint');
INSERT INTO `Restaurant` (`Name`) VALUES ('TacoTown');

-- Discount - BurgerJoint
INSERT INTO `Discount` (`RestaurantID`, `DiscountCode`, `Type`, `Value`)
SELECT `Restaurant`.`RestaurantID`, '50OFF', 'Percent', 50
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Discount` (`RestaurantID`, `DiscountCode`, `Type`, `Value`)
SELECT `Restaurant`.`RestaurantID`, '10OFF', 'Percent', 10
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Discount` (`RestaurantID`, `DiscountCode`, `Type`, `Value`)
SELECT `Restaurant`.`RestaurantID`, '5BUCKS', 'Amount', 5.00
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

-- Discount - TacoTown
INSERT INTO `Discount` (`RestaurantID`, `DiscountCode`, `Type`, `Value`)
SELECT `Restaurant`.`RestaurantID`, 'TACOTUESDAY', 'Percent', 15
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Discount` (`RestaurantID`, `DiscountCode`, `Type`, `Value`)
SELECT `Restaurant`.`RestaurantID`, 'FREE', 'Percent', 100
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Discount` (`RestaurantID`, `DiscountCode`, `Type`, `Value`)
SELECT `Restaurant`.`RestaurantID`, 'MINUS10', 'Amount', 10.00
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

-- BurgerJoint users
INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'joe.smith', SHA1('password'), 'Host', 'Joe', 'Smith' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'rick.james', SHA1('password'), 'Kitchen Staff', 'Rick', 'James' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'michael.jackson', SHA1('password'), 'Kitchen Staff', 'Michael', 'Jackson' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'steve.arrington', SHA1('password'), 'Wait Staff', 'Steve', 'Arrington' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'quincy.jones', SHA1('password'), 'Wait Staff', 'Quincy', 'Jones' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'bootsy.collins', SHA1('password'), 'Manager', 'Bootsy', 'Collins' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'george.clinton', SHA1('password'), 'Administrator', 'George', 'Clinton' 
FROM `Restaurant` WHERE `Name` = 'BurgerJoint';

-- TacoTown users
INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'tupac.shakur', SHA1('password'), 'Host', 'Tupac', 'Shakur' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'snoop.dogg', SHA1('password'), 'Kitchen Staff', 'Calvin', 'Broadus' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'nate.dogg', SHA1('password'), 'Kitchen Staff', 'Nate', 'Dogg' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'dr.dre', SHA1('password'), 'Wait Staff', 'Dr', 'Dre' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'q.tip', SHA1('password'), 'Wait Staff', 'Q', 'Tip' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'phife.dawg', SHA1('password'), 'Manager', 'Malik', 'Dynomutt' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

INSERT INTO `User` (`RestaurantID`,`Username`,`PasswordHash`,`Role`,`FName`,`LName`) 
SELECT `RestaurantID`, 'afrika.bambaataa', SHA1('password'), 'Administrator', 'Afrika', 'Bambaataa' 
FROM `Restaurant` WHERE `Name` = 'TacoTown';

-- Table - BurgerJoint
INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '1', '2', `User`.`UserID`, 'Occupied'
FROM `User` WHERE `Username` = 'steve.arrington';

INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '2', '2', `User`.`UserID`, 'Available'
FROM `User` WHERE `Username` = 'steve.arrington';

INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '3', '4', `User`.`UserID`, 'Available'
FROM `User` WHERE `Username` = 'quincy.jones';

INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '4', '7', `User`.`UserID`, 'Occupied'
FROM `User` WHERE `Username` = 'quincy.jones';

-- Table - TacoTown
INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '1', '5', `User`.`UserID`, 'Occupied'
FROM `User` WHERE `Username` = 'dr.dre';

INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '2', '7', `User`.`UserID`, 'Available'
FROM `User` WHERE `Username` = 'dr.dre';

INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '3', '2', `User`.`UserID`, 'Available'
FROM `User` WHERE `Username` = 'q.tip';

INSERT INTO `Table` (`RestaurantID`,`Number`,`Capacity`,`UserID`,`Status`) 
SELECT `User`.`RestaurantID`, '4', '4', `User`.`UserID`, 'Occupied'
FROM `User` WHERE `Username` = 'q.tip';

-- WaitList - BurgerJoint
INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Dmitri', '4', `RestaurantID`, '2013-07-08 18:11:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Simone', '2', `RestaurantID`, '2013-07-08 18:21:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Darla', '3', `RestaurantID`, '2013-07-08 18:51:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Calvin', '6', `RestaurantID`, '2013-07-08 19:21:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

-- Waitlist - TacoTown
INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Elmer', '5', `RestaurantID`, '2013-07-08 18:01:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Oscar', '3', `RestaurantID`, '2013-07-08 18:31:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Lola', '2', `RestaurantID`, '2013-07-08 19:01:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `WaitList` (`Name`, `Size`, `RestaurantID`, `Timestamp`)
SELECT 'Pipi', '4', `RestaurantID`, '2013-07-08 19:31:01'
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

-- MenuItem - BurgerJoint
INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Jalapeno Poppers', '12', 'Appetizer', '5.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Nachos', '8', 'Appetizer', '4.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Plain Burger', '10', 'Main Course', '8.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Cheeseburger', '14', 'Main Course', '9.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Steak', '22', 'Main Course', '18.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Ice Cream Sundae', '10', 'Dessert', '3.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Chocolate Pie', '10', 'Dessert', '5.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'BurgerJoint';

-- MenuItem - TacoTown
INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Chips and Salsa', '4', 'Appetizer', '5.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Pico de Gallo', '3', 'Appetizer', '2.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Tortilla Soup', '9', 'Appetizer', '3.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Chili Verde', '15', 'Main Course', '9.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Enchilada', '19', 'Main Course', '10.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Quesadillas de Pollo', '17', 'Main Course', '11.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Fried Ice Cream', '6', 'Dessert', '4.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `MenuItem` (`RestaurantID`, `Name`, `PrepTime`, `Category`, `Price`)
SELECT `RestaurantID`, 'Sopapillas', '10', 'Dessert', '2.99' 
FROM `Restaurant` WHERE `Restaurant`.`Name` = 'TacoTown';

-- Order - BurgerJoint
INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 12:01:01'
FROM `Table`, `Restaurant` WHERE `Table`.`Number` = '1' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 13:01:01'
FROM `Table`, `Restaurant` WHERE `Table`.`Number` = '1' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Tip` (`UserID`, `TableID`, `Amount`, `Paid`)
SELECT `User`.`UserID`, `Order`.`TableID`, 7.75, 0
FROM `User`, `Order` WHERE `User`.`Username` = 'bootsy.collins'
AND `Order`.`OrderID` = LAST_INSERT_ID();

INSERT INTO `Discounted` (`DiscountID`, `TableID`)
SELECT `Discount`.`DiscountID`, `Tip`.`TableID`
FROM `Discount`, `Tip` WHERE `Discount`.`DiscountCode` = '5BUCKS'
AND `Tip`.`TipID` = LAST_INSERT_ID();

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 12:31:01'
FROM `Table`, `Restaurant` WHERE `Table`.`Number` = '4' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 13:01:01'
FROM `Table`, `Restaurant`, `Order` WHERE `Table`.`Number` = '4' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 14:01:01'
FROM `Table`, `Restaurant`, `Order` WHERE `Table`.`Number` = '4' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'BurgerJoint';

INSERT INTO `Tip` (`UserID`, `TableID`, `Amount`, `Paid`)
SELECT `User`.`UserID`, `Order`.`TableID`, 3.75, 1
FROM `User`, `Order` WHERE `Order`.`TableID` AND `User`.`Username` = 'rick.james'
AND `Order`.`OrderID` = LAST_INSERT_ID();

INSERT INTO `Discounted` (`DiscountID`, `TableID`)
SELECT `Discount`.`DiscountID`, `Tip`.`TableID`
FROM `Discount`, `Tip` WHERE `Discount`.`DiscountCode` = '5BUCKS'
AND `Tip`.`TipID` = LAST_INSERT_ID();

-- Order - TacoTown
INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 16:01:01'
FROM `Table`, `Restaurant` WHERE `Table`.`Number` = '1' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 16:21:01'
FROM `Table`, `Restaurant`, `Order` WHERE `Table`.`Number` = '1' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 16:51:01'
FROM `Table`, `Restaurant`, `Order` WHERE `Table`.`Number` = '1' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Tip` (`UserID`, `TableID`, `Amount`, `Paid`)
SELECT `User`.`UserID`, `Order`.`TableID`, 2.50, 1
FROM `User`, `Order` WHERE `Order`.`TableID` AND `User`.`Username` = 'dr.dre'
AND `Order`.`OrderID` = LAST_INSERT_ID();

INSERT INTO `Discounted` (`DiscountID`, `TableID`)
SELECT `Discount`.`DiscountID`, `Tip`.`TableID`
FROM `Discount`, `Tip` WHERE `Discount`.`DiscountCode` = 'TACOTUESDAY'
AND `Tip`.`TipID` = LAST_INSERT_ID();

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 17:01:01'
FROM `Table`, `Restaurant` WHERE `Table`.`Number` = '4' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Order` (`TableID`, `Timestamp`)
SELECT `Table`.`TableID`, '2013-07-08 17:01:01'
FROM `Table`, `Restaurant`, `Order` WHERE `Table`.`Number` = '4' 
AND `Restaurant`.`RestaurantID` = `Table`.`RestaurantID` AND `Restaurant`.`Name` = 'TacoTown';

INSERT INTO `Tip` (`UserID`, `TableID`, `Amount`, `Paid`)
SELECT `User`.`UserID`, `Order`.`TableID`, 4.50, 0
FROM `User`, `Order` WHERE `Order`.`TableID` AND `User`.`Username` = 'tupac.shakur'
AND `Order`.`OrderID` = LAST_INSERT_ID();

INSERT INTO `Discounted` (`DiscountID`, `TableID`)
SELECT `Discount`.`DiscountID`, `Tip`.`TableID`
FROM `Discount`, `Tip` WHERE `Discount`.`DiscountCode` = 'MINUS10'
AND `Tip`.`TipID` = LAST_INSERT_ID();

-- OrderItem - BurgerJoint
-- table 1
INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Jalapeno Poppers'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 12:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready', 'Extra Cheese'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Nachos'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 12:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'InPrep', 'Well Done'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Cheeseburger'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 13:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'InPrep', 'Medium Rare'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Steak'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 13:01:01';

-- table 4
INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Nachos'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 12:31:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Nachos'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 12:31:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready', 'No pickles'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Plain Burger'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 13:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready', 'Medium Well'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Steak'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 13:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'New'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Ice Cream Sundae'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 14:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'New'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'BurgerJoint' AND `MenuItem`.`Name` = 'Chocolate Pie'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 14:01:01';

-- OrderItem - TacoTown
-- table 4
INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Chili Verde'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 12:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready', 'Extra green sauce'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Quesadillas de Pollo'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 12:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'InPrep'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Sopapillas'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 13:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'InPrep'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Sopapillas'
AND `Table`.`Number` = '4' AND `Order`.`Timestamp` = '2013-07-08 13:01:01';

-- table 1
INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Pico De Gallo'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 16:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`, `Notes`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready', 'No beans'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Tortilla Soup'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 16:01:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Enchilada'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 16:21:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'Ready'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Chili Verde'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 16:21:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'InPrep'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Fried Ice Cream'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 16:51:01';

INSERT INTO `OrderItem` (`MenuItemID`, `OrderID`, `PurchasePrice`, `Status`)
SELECT `MenuItem`.`MenuItemID`, `Order`.`OrderID`, `MenuItem`.`Price`, 'InPrep'
FROM `Order`, `Table`, `MenuItem`, `Restaurant`
WHERE `Order`.`TableID` = `Table`.`TableID` AND `Table`.`RestaurantID` = `Restaurant`.`RestaurantID` AND `MenuItem`.`RestaurantID` = `Restaurant`.`RestaurantID` 
AND `Restaurant`.`Name` = 'TacoTown' AND `MenuItem`.`Name` = 'Sopapillas'
AND `Table`.`Number` = '1' AND `Order`.`Timestamp` = '2013-07-08 16:51:01';

