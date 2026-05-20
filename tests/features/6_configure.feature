Feature: AI Bot Configuration

  Background:
    Given I am logged in

  Scenario: Update general configuration settings
    Given I am on the Configure page
    When I update the professional info to "Welcome to Testhub! How can we help you today?"
    And I update the AI tone to "Customer-friendly and professional"
    And I toggle all general settings
    And I save the configuration
    Then I should see a success message

  Scenario: Verify configuration page elements
    Given I am on the Configure page
    Then the professional info field should be visible
    And the AI tone field should be visible
    And the save button should be visible
