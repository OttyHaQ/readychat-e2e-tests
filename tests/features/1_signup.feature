@signup @smoke @critical @regression
Feature: User Signup Flow

  Scenario: Complete user signup and onboarding workflow
    Given I am on the landing page
    When I navigate to the signup page
    And I fill and submit the signup form with generated credentials
    And I save test credentials to file
    And I complete the personal details step
    And I complete the business information step
    And I complete the bot settings step
    And I complete the business schedule step
    And I click the Go Now button
    Then I should be redirected to the dashboard
