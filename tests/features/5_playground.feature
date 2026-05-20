Feature: AI Bot Playground

  Background:
    Given I am logged in

  Scenario: Send a message successfully
    Given I am on the Playground page
    Then the playground header and welcome message should be visible
    When I type "I want to place an order" and add an emoji and send
    Then the sent message should be visible

  Scenario: Display and use example prompts
    Given I am on the Playground page
    Then all example prompt buttons should be visible
    When I click the order prompt and send
    Then the sent message should contain the order prompt text

  Scenario: Reset playground conversation
    Given I am on the Playground page
    When I send an example prompt message
    And I reset the playground
    Then the conversation should be reset to the initial state

  Scenario: Navigate to Data Sources via Add More Knowledge link
    Given I am on the Playground page
    When I click the Add More Knowledge link
    Then I should be on the Data Sources page

  Scenario: Handle emoji picker interaction
    Given I am on the Playground page
    When I open the emoji picker and select an emoji
    Then the emoji should appear in the chat input field

  Scenario: Handle multiple messages in conversation
    Given I am on the Playground page
    When I send the playground message "Hello"
    And I wait for the response and send "I need help"
    And I wait for the response and send an example prompt
    Then all messages should be sent successfully
