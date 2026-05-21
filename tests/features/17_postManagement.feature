@regression
Feature: Post Management

  Background:
    Given I am logged in

  Scenario: Verify post management page loads
    Given I am on the Post Management page
    Then the post management page or module should be accessible

  Scenario: Verify post list table is displayed
    Given I am on the Post Management page
    Then the post list or table should be visible if the section exists

  Scenario: Create a new post
    Given I am on the Post Management page
    When I create a new post with title "Automation Test Post"
    Then the post creation action should complete

  Scenario: Edit an existing post
    Given I am on the Post Management page
    And at least one post exists
    When I edit the first post with title "Updated Automation Post"
    Then the post edit action should complete

  Scenario: Delete a post
    Given I am on the Post Management page
    And at least one post exists
    When I delete the first post
    Then the post delete action should complete

  Scenario: Verify customer management section is accessible
    Given I am on the Post Management page
    Then the customer or contacts section should be accessible

  Scenario: Create a new customer
    Given I am on the Post Management page
    When I create a new customer with name "Test Customer Automation" and email "testcustomer@automation.com"
    Then the customer creation action should complete

  Scenario: Verify auto-reply settings are accessible
    Given I am on the Post Management page
    Then the auto-reply settings or defaults section should be accessible
