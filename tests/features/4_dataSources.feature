Feature: Data Sources Management

  Background:
    Given I am logged in

  Scenario: Display unanswered questions table with all columns
    Given I am on the Data Sources page
    Then the unanswered questions tab should be visible
    And the add new question button should be visible

  Scenario: Navigate to answered questions tab
    Given I am on the Data Sources page
    When I switch to the answered questions tab
    Then the answered tab should load successfully

  Scenario: Navigate between unanswered and answered tabs
    Given I am on the Data Sources page
    Then the unanswered questions tab should be visible
    When I switch to the answered questions tab
    Then the answered tab should load successfully

  Scenario: Reorder table columns
    Given I am on the Data Sources page
    When I switch to the answered questions tab
    And I open the reorder panel and save
    And I open the reorder panel and cancel
    Then the reorder actions should complete successfully

  Scenario: Add a new question
    Given I am on the Data Sources page
    When I open the add question modal
    And I fill and submit a new question and answer
    Then I should see a success or duplicate alert
