Feature: Home Page navigation

  Tests when not logged in

  Scenario: Home to Music
    Given I go to the Unearthed website
    When I click the "Discover" More link
    Then I am on the "Music" tab

  Scenario: Home to Reviews
    Given I go to the Unearthed website
    When I click the "Recent Staff Reviews" More link
    Then I am on the "Reviews" tab

