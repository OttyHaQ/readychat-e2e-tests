@new-user-test @smoke @critical @regression
Feature: User Sign In Flow

  Scenario: Successfully sign in with valid credentials
    Given I am on the landing page
    When I navigate to the sign in page
    And I sign in with valid credentials
    Then I should see a successful authentication message
    And I should be redirected to the dashboard

  Scenario: Fail to sign in with invalid credentials
    Given I am on the landing page
    When I navigate to the sign in page
    And I sign in with credentials "invalid_username_12345" and "invalid_password_12345"
    Then I should see a login error message
    And I should remain on the sign in page

  Scenario: Navigate to forgot password page
    Given I am on the landing page
    When I navigate to the sign in page
    And I click the forgot password link
    Then I should be on the forgot password page

  Scenario: Navigate to sign up page from sign in
    Given I am on the landing page
    When I navigate to the sign in page
    And I click the create account link
    Then I should be on the signup page

  Scenario: Show error for empty username
    Given I am on the sign in page directly
    When I submit the sign in form with username "" and password "somepassword"
    Then I should see a username required error

  Scenario: Show error for empty password
    Given I am on the sign in page directly
    When I submit the sign in form with username "someusername" and password ""
    Then I should see a password required error
