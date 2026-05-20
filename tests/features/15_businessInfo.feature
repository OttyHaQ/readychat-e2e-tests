Feature: Business Info - Comprehensive Tests

  Background:
    Given I am logged in
    And I am on the Business Info page

  Scenario: Display all business info form fields
    Then the basic information fields should be visible
    And the address fields should be visible
    And the contact and settings fields should be visible
    And the business hours checkboxes should be visible
    And the update button should be visible

  Scenario: Update business information
    When I get the current form values
    And I fill in the basic info with business name "Automated Test Business" email "test_business@mailinator.com"
    And I fill in the address info with address "123 Test Street, Test Area" city "Test City" country "Nigeria"
    And I fill in the contact settings with phone "+234 8099999999" timezone "(GMT+01:00) Africa/Lagos" currency "₦ NGN"
    And I click the Update button
    Then I should see a business info success message
    And the values should persist after reload

  Scenario: Validate required fields
    When I clear the business name field and click Update
    Then a validation error should be displayed or HTML5 validation triggered
