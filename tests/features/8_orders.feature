@critical @regression
Feature: Order Management

  Background:
    Given I am logged in

  Scenario: Display all order metrics
    Given I am on the Orders page
    Then all order metrics should be visible including total, completed, in progress, cancelled, and sales

  Scenario: Display all order status tabs
    Given I am on the Orders page
    When I switch to each order status tab
    Then each tab header should reflect the correct status

  Scenario: Display all table columns
    Given I am on the Orders page
    Then all order table columns should be visible including ID, Products, Customer, Created, Quantity, Total Cost, Channels, Status, and Actions

  Scenario: Reorder and manage table columns
    Given I am on the Orders page
    When I open the reorder columns modal and toggle all columns
    And I save the column order
    Then the column order should be saved successfully

  Scenario: Export orders in different formats
    Given I am on the Orders page
    When I open the export modal
    And I export to CSV
    And I export to XLSX
    And I export to PDF
    And I close the export modal
    Then all export formats should be initiated

  Scenario: Change order status
    Given I am on the Orders page
    When I attempt to change an order status
    Then the status change should complete successfully or no changeable orders exist

  Scenario: Cancel an order
    Given I am on the Orders page
    And at least one cancellable order exists
    When I navigate to all orders and cancel an order
    Then the cancel action should complete successfully

  Scenario: Delete a cancelled order
    Given I am on the Orders page
    When I navigate to all orders and delete an order
    Then the delete action should complete successfully

  Scenario: View and edit order details
    Given I am on the Orders page
    And at least one cancellable order exists
    When I navigate to all orders and view the first order details
    Then the order details page should show order ID and customer details
    When I edit the order with notes "Updated order via automation" and quantity "5"
    Then I should see a success or stock limit message

  Scenario: Create a new order
    Given I am on the Orders page
    When I initiate creating a new order
    Then the new order creation form or flow should appear
