@new-user-test
Feature: Channels Integration

  Background:
    Given I am logged in as a new user

  Scenario: Integrate Facebook channel successfully
    Given I am on the Channels page
    When I click the Integrate Facebook button
    Then I should see the Facebook integration popup
    And the Facebook authentication flow should complete

  Scenario: Integrate WhatsApp channel successfully
    Given I am on the Channels page
    When I click the Integrate WhatsApp button
    Then I should see the WhatsApp integration popup
    And the WhatsApp authentication popup should open

  Scenario: Integrate Instagram channel successfully
    Given I am on the Channels page
    When I click the Integrate Instagram button
    Then I should see the Instagram integration popup
    And the Instagram authentication popup should open

  Scenario: Display Learn More button on Channels page
    Given I am on the Channels page
    Then the Learn More button should be visible and functional

  Scenario: Display all integration options
    Given I am on the Channels page
    Then all integration buttons should be visible
