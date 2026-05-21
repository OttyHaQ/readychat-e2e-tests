@regression
Feature: Website Widget Configuration

  Background:
    Given I am logged in

  Scenario: Verify website widget page loads
    Given I am on the Website Widget page
    Then the website widget page should be accessible

  Scenario: Verify widget settings are displayed
    Given I am on the Website Widget page
    Then the widget configuration settings should be visible

  Scenario: Update widget settings
    Given I am on the Website Widget page
    When I update the widget greeting message to "Hello! How can we help you?"
    Then the widget settings update should complete

  Scenario: Verify embed code section is present
    Given I am on the Website Widget page
    Then the embed code or installation script section should be visible

  Scenario: Copy embed code
    Given I am on the Website Widget page
    When I copy the widget embed code
    Then the copy action should complete or the embed code should be accessible

  Scenario: Toggle widget enabled state
    Given I am on the Website Widget page
    When I toggle the website widget enabled state
    Then the toggle action should complete
