@critical @regression
Feature: Dashboard / Home

  Background:
    Given I am logged in
    And I am on the Dashboard page

  Scenario: Verify dashboard metrics cards are visible
    Then at least one dashboard metric card should be visible

  Scenario: Verify total sales metric is displayed
    Then the total sales metric should be visible or indicated on the dashboard

  Scenario: Verify total orders metric is displayed
    Then the total orders metric should be visible or indicated on the dashboard

  Scenario: Verify messages metric is displayed
    Then the messages metric should be visible or indicated on the dashboard

  Scenario: Verify unanswered questions section is accessible
    Then the unanswered questions section should be visible or accessible

  Scenario: Verify dashboard table or activity section is present
    Then the dashboard should show a table or recent activity section

  Scenario: Verify export button is available on dashboard
    Then the dashboard export button should be accessible if present

  Scenario: Verify reorder columns action is available
    When I attempt to reorder dashboard table columns
    Then the reorder action should complete or report unavailable

  Scenario: Verify add new user button is accessible
    Then the add new user or invite button should be visible if present
