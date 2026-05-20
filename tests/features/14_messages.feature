Feature: Messages Page

  Background:
    Given I am logged in
    And I am on the Messages page

  Scenario: Verify all message tabs are active and functional
    When I click through all message tabs
    Then each tab should be visible and clickable

  Scenario: Search conversations in messages list
    When I search conversations for "order"
    And I clear the conversation search
    Then the conversation search should work correctly

  Scenario: Search within a specific message
    When I select the first conversation
    And I search within the message thread for "product"
    Then the in-message search should complete

  Scenario: Favorite a conversation
    When I select the first conversation
    And I ensure the conversation is not favorited
    And I click the star icon to favorite
    Then the conversation should be favorited

  Scenario: Unfavorite a conversation
    When I select the first conversation
    And I ensure the conversation is favorited
    And I click the star icon to unfavorite
    Then the conversation should not be favorited

  Scenario: Toggle Chat AI on and off
    When I select the first conversation
    Then the Chat AI toggle should be visible
    When I toggle the Chat AI off
    And I toggle the Chat AI on
    Then the Chat AI toggle actions should complete

  Scenario: Send a message successfully
    When I select the first conversation
    And I send the message "This is an automated test message from Playwright"
    Then the message should appear in the thread

  @skip
  Scenario: Block a user
    When I find and select the conversation for "Test Customer"
    And I block the user
    Then the block action should complete

  @skip
  Scenario: Delete a conversation
    When I find and select the conversation for "Flora Ready"
    And I delete the conversation
    Then the conversation should be removed
