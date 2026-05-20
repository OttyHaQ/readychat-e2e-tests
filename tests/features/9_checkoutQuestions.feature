Feature: Checkout Questions Management

  Background:
    Given I am logged in

  Scenario: Verify column headers are displayed
    Given I am on the Checkout Questions page
    Then the column headers should include Question, Reorder, and Action

  Scenario: Export checkout questions in different formats
    Given I am on the Checkout Questions page
    When I open the checkout questions export modal
    And I export to CSV format with download
    And I export to XLSX format with download
    And I export to PDF format with download
    And I close the checkout questions export modal
    Then all export downloads should complete

  Scenario: Add a new checkout question
    Given I am on the Checkout Questions page
    When I add a new question with type "Text" and required true
    Then I should see a success message
    And the new question should appear in the table after reload

  Scenario: Edit a checkout question
    Given I am on the Checkout Questions page
    And at least one question exists
    When I edit the first question with an updated question text
    Then I should see a success message
    And the updated question should appear in the table

  Scenario: Delete a checkout question
    Given I am on the Checkout Questions page
    When I create a question for deletion
    And I sort by descending and delete the first question
    Then I should see a success message

  Scenario: Reorder questions
    Given I am on the Checkout Questions page
    And at least two questions exist
    When I attempt to reorder questions via drag and drop
    Then the table should maintain data integrity after reorder
