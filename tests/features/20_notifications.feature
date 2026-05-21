@regression
Feature: Notifications

  Background:
    Given I am logged in

  Scenario: Verify in-app notification center is accessible
    Given I am on the Dashboard page
    Then the notification bell or icon should be visible

  Scenario: Open in-app notification center
    Given I am on the Dashboard page
    When I open the notification center
    Then the notification panel or center should appear

  Scenario: Verify notification settings page loads
    Given I am on the Notifications Settings page
    Then the notifications settings page should be accessible

  Scenario: Verify email notification triggers are configurable
    Given I am on the Notifications Settings page
    Then the email notification triggers should be visible or configurable

  Scenario: Toggle email notification trigger
    Given I am on the Notifications Settings page
    When I toggle an email notification trigger
    Then the notification toggle action should complete

  Scenario: Verify SMS notification triggers are accessible
    Given I am on the Notifications Settings page
    Then the SMS notification triggers should be visible if supported

  Scenario: Verify notification history is accessible
    Given I am on the Notifications Settings page
    Then the notification history or log should be accessible
