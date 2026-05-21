Feature: Products Management

  Background:
    Given I am logged in

  Scenario: Verify products metrics are displayed
    Given I am on the Products page
    Then at least one product metric should be visible

  Scenario: Verify products table headers and tabs are displayed
    Given I am on the Products page
    Then the products table should have visible column headers
    And the deleted tab should be accessible if present

  Scenario: Verify user can export table data
    Given I am on the Products page
    When I export products to CSV
    And I export products to XLSX
    And I export products to PDF
    And I close the products export modal
    Then all product export formats should be initiated

  Scenario: Verify user can add new product
    Given I am on the Products page
    When I add a new product with price "99.99" stock "100" and description "Test product created by automation"
    Then I should see a product success message

  Scenario: Verify user can edit product
    Given I am on the Products page
    And at least one product exists
    When I edit the first product with price "149.99" and stock "35"
    Then I should see a product success message
    And the updated product should appear in the table

  Scenario: Verify user can delete product
    Given I am on the Products page
    When I create a product for deletion
    And I sort products by descending and delete the first product
    Then I should see a product success message

  Scenario: Verify user can reorder columns
    Given I am on the Products page
    When I attempt to reorder product columns
    Then the reorder action should complete or report unavailable

  Scenario: Search and filter products by name
    Given I am on the Products page
    When I search for a product by name "Test"
    Then the products table should be filtered or a no results message should appear

  Scenario: Bulk delete products
    Given I am on the Products page
    And at least two products exist
    When I select multiple products using bulk selection
    And I trigger bulk delete for selected products
    Then the bulk delete action should complete or a confirmation should appear
