@regression
Feature: User Management

  Background:
    Given I am logged in

  Scenario: Verify user management page loads
    Given I am on the User Management page
    Then the user management page should be accessible

  Scenario: Verify user list table is displayed
    Given I am on the User Management page
    Then the user list or team table should be visible

  Scenario: Verify column headers on user table
    Given I am on the User Management page
    Then the user table should have visible column headers

  Scenario: Invite a new user
    Given I am on the User Management page
    When I invite a user with email "automation-test-user@mailinator.com" and role "Agent"
    Then the invite action should complete successfully or show a duplicate warning

  Scenario: Verify roles and permissions are accessible
    Given I am on the User Management page
    Then the roles or permissions section should be accessible

  Scenario: Verify working hours or availability settings
    Given I am on the User Management page
    Then the working hours or availability section should be accessible
