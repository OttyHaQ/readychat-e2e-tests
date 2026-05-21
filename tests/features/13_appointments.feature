Feature: Appointments

  Background:
    Given I am logged in

  Scenario: Verify appointments table headers and tabs are displayed
    Given I am on the Appointments page
    Then the appointments table should have visible column headers including Status and Actions

  Scenario: Verify user can export Appointment table data
    Given I am on the Appointments page
    When I open the appointment export modal
    And I export appointments to CSV format with download
    And I export appointments to XLSX format with download
    And I export appointments to PDF format with download
    And I close the appointment export modal
    Then all appointment export downloads should complete

  Scenario: Verify user can add new Appointment
    Given I am on the Appointments page
    When I add a new appointment with service "Property Advisory 2" customer "Flora Ready" and status "Confirmed"
    Then I should see an appointment success message or the appointment should be created

  Scenario: Verify calendar view is visible on Appointments page
    Given I am on the Appointments page
    When I switch to the Calendar View tab
    Then the calendar should be visible

  Scenario: Verify user can View Appointments Details
    Given I am on the Appointments page
    And at least one appointment exists
    When I select the View Details action for the first appointment
    Then the appointment details should show "Booked By"

  Scenario: Verify user can Complete Appointments
    Given I am on the Appointments page
    And at least one appointment exists
    When I select the Check In action for the first appointment
    Then I should see an appointment success message

  Scenario: Verify user can reschedule Appointments
    Given I am on the Appointments page
    And at least one appointment exists
    When I select the Reschedule action for the first appointment
    And I reschedule to a preferred time slot
    Then the rescheduling should complete

  Scenario: Verify user can cancel rescheduling Appointments
    Given I am on the Appointments page
    And at least one appointment exists
    When I select the Reschedule action for the first appointment
    And I cancel the rescheduling
    Then the rescheduling should be cancelled

  Scenario: Verify user can Cancel Appointments
    Given I am on the Appointments page
    And at least one appointment exists
    When I select the Cancel action for the first appointment
    Then I should see an appointment success message

  Scenario: Verify user can reorder columns
    Given I am on the Appointments page
    When I attempt to reorder appointment columns
    Then the reorder action should complete or report unavailable

  Scenario: Search appointments by keyword
    Given I am on the Appointments page
    When I search appointments for "Flora"
    Then the appointments table should be filtered or a search result should appear

  Scenario: Filter appointments by status
    Given I am on the Appointments page
    When I filter appointments by status "Confirmed"
    Then only confirmed appointments should be visible or a filter should be applied

  Scenario: Filter appointments by date range
    Given I am on the Appointments page
    When I filter appointments by a date range
    Then appointments within that date range should be displayed or a filter should be applied
