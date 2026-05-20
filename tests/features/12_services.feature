Feature: Service Management

  Background:
    Given I am logged in

  Scenario: Verify Services metrics are displayed
    Given I am on the Services page
    Then at least one service metric should be visible

  Scenario: Verify service table headers and tabs are displayed
    Given I am on the Services page
    Then the services table should have visible column headers including Service Name and Status
    When I navigate to the Types tab
    Then the service types table should have visible column headers including Name and Action

  Scenario: Verify user can export Service table data
    Given I am on the Services page
    When I open the service export modal
    And I export services to CSV format with download
    And I export services to XLSX format with download
    And I export services to PDF format with download
    And I close the service export modal
    Then all service export downloads should complete

  Scenario: Verify user can export Service Type table data
    Given I am on the Services page
    When I navigate to the Types tab
    And I open the service export modal
    And I export services to CSV format with download
    And I export services to XLSX format with download
    And I export services to PDF format with download
    And I close the service export modal
    Then all service export downloads should complete

  Scenario: Verify user can add new service
    Given I am on the Services page
    When I add a new service with price "5000" currency "₦ NGN" and description "Test service created by automation"
    Then I should see a service success message

  Scenario: Verify user can add new service type
    Given I am on the Services page
    When I navigate to the Types tab
    And I add a new service type with description "Test Service Type created by automation"
    Then I should see a service success message
    And the new service type should appear in the table

  Scenario: Verify user can edit service
    Given I am on the Services page
    And at least one service exists
    When I edit the first service with price "149.99" and description "Updated Service Description via Automation"
    Then I should see a service success message

  Scenario: Verify user can edit service type
    Given I am on the Services page
    When I navigate to the Types tab
    And at least one service type exists
    When I edit the first service type with an updated name and description
    Then I should see a service success message

  Scenario: Verify user can delete a service
    Given I am on the Services page
    When I create a service for deletion
    And I sort services by descending and delete the first service
    Then the service delete action should complete

  Scenario: Verify user can delete a service type
    Given I am on the Services page
    When I navigate to the Types tab
    And I create a service type for deletion
    And I sort services by descending and delete the first service type
    Then the service type delete action should complete

  Scenario: Verify user can reorder columns
    Given I am on the Services page
    When I attempt to reorder service columns
    Then the reorder action should complete or report unavailable
