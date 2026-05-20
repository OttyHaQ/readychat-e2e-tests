@skip
Feature: Escalation Management

  Background:
    Given I am logged in

  Scenario: Accept an unassigned ticket
    Given I am on the Escalation page
    When I switch to the unassigned tickets tab
    Then I should be able to accept the first available ticket

  Scenario: Open chat for a ticket
    Given I am on the Escalation page
    When I switch to the my tickets tab
    Then I should be able to open chat for the first available ticket

  Scenario: Resolve a ticket
    Given I am on the Escalation page
    When I switch to the my tickets tab
    Then I should be able to resolve the first available ticket

  Scenario: Reopen a resolved ticket
    Given I am on the Escalation page
    When I switch to the resolved tickets tab
    Then I should be able to reopen the first available ticket

  @skip
  Scenario: Close a ticket
    Given I am on the Escalation page
    When I switch to the resolved tickets tab
    Then I should be able to close the first available ticket

  Scenario: Sort tickets by different priorities
    Given I am on the Escalation page
    When I sort tickets by all available options
    Then all sort options should be applied successfully

  Scenario: Search for tickets
    Given I am on the Escalation page
    When I search for tickets with the term "test"
    Then the search field should contain "test"

  Scenario: Filter tickets by priority
    Given I am on the Escalation page
    When I filter by high priority
    And I filter by medium priority
    And I filter by low priority
    And I reset to all priorities
    Then each priority filter should be reflected in the dropdown

  Scenario: Verify all tabs are accessible
    Given I am on the Escalation page
    Then all ticket tabs should be visible
    When I navigate through each tab
    Then each tab should be accessible
