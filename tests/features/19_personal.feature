@regression
Feature: Personal Settings

  Background:
    Given I am logged in

  Scenario: Verify personal settings page loads
    Given I am on the Personal Settings page
    Then the personal settings page should be accessible

  Scenario: Verify personal details fields are visible
    Given I am on the Personal Settings page
    Then the personal details fields should be visible including name and email

  Scenario: Update personal details
    Given I am on the Personal Settings page
    When I update my personal details with first name "Automation" and last name "Tester"
    Then I should see a personal update success message

  Scenario: Verify business logo upload is accessible
    Given I am on the Personal Settings page
    Then the logo or branding upload section should be accessible

  Scenario: Upload business logo
    Given I am on the Personal Settings page
    When I upload the business logo using "tests/fixtures/office_1.jpg"
    Then the logo upload action should complete

  Scenario: Verify notification preferences are accessible
    Given I am on the Personal Settings page
    Then the notification preferences section should be accessible

  Scenario: Toggle notification preferences
    Given I am on the Personal Settings page
    When I toggle the email notification preference
    Then the notification preference change should complete

  Scenario: Verify security settings are accessible
    Given I am on the Personal Settings page
    Then the security settings section should be accessible

  Scenario: Change account password
    Given I am on the Personal Settings page
    When I change my password to a new secure password
    Then the password change should complete and the new password should be saved

  Scenario: Verify billing or subscription section is accessible
    Given I am on the Personal Settings page
    Then the billing or subscription section should be accessible
