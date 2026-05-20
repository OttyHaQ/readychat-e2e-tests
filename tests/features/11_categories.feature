Feature: Categories Management

  Background:
    Given I am logged in

  Scenario: Verify categories metrics are displayed
    Given I am on the Categories page
    Then at least one category metric should be visible

  Scenario: Verify category table headers and tabs are displayed
    Given I am on the Categories page
    Then the categories table should have visible column headers including Name and Actions

  Scenario: Verify user can export table data
    Given I am on the Categories page
    When I open the categories export modal
    And I export categories to CSV format with download
    And I export categories to XLSX format with download
    And I export categories to PDF format with download
    And I close the categories export modal
    Then all category export downloads should complete

  Scenario: Verify user can add new category
    Given I am on the Categories page
    When I add a new category with description "Test Description created by automation"
    Then I should see a category success message

  Scenario: Verify user can edit category
    Given I am on the Categories page
    And at least one category exists
    When I edit the first category with an updated name and description
    Then I should see a category success message

  Scenario: Verify user can delete category
    Given I am on the Categories page
    When I create a category for deletion
    And I sort categories by descending and delete the first category
    Then I should see a category success message

  Scenario: Verify user can reorder columns
    Given I am on the Categories page
    When I attempt to reorder category columns
    Then the reorder action should complete or report unavailable
