# Spec delta — CRM demo capabilities

## ADDED Requirements

### Requirement: Simulated role-based authentication
The system SHALL let a user "log in" by choosing one of three roles and SHALL
scope navigation and available screens to that role.

#### Scenario: Quick login as a role
- **WHEN** the user clicks a role shortcut on the login screen
- **THEN** a session for that role's demo user is created and the user lands on
  that role's home screen

#### Scenario: Role-scoped navigation
- **WHEN** an authenticated user views the app shell
- **THEN** only the navigation entries allowed for their role are shown, and
  visiting a disallowed route redirects to their home

#### Scenario: Logout
- **WHEN** the user logs out
- **THEN** the session is cleared and the login screen is shown

### Requirement: Client directory
The system SHALL present the wholesaler's clients with their commercial data,
current account balance and credit limit, and allow creating a new client.

#### Scenario: Browse and filter clients
- **WHEN** an admin or encargado opens Clientes
- **THEN** clients are listed with type, zone, balance and status, filterable by
  text and zone

#### Scenario: Register a new client
- **WHEN** the user submits the new-client form with required fields
- **THEN** the client appears immediately in the list (in-memory)

### Requirement: Order management
The system SHALL let staff create orders from the product catalog and advance an
order through its lifecycle: pendiente → confirmado → preparación → en camino →
entregado, with cancelado as a terminal alternative.

#### Scenario: Create an order
- **WHEN** the user selects a client, adds catalog products with quantities and
  confirms
- **THEN** a new order is created with the computed total in status pendiente

#### Scenario: Advance order status
- **WHEN** the user advances an order to the next status
- **THEN** the order reflects the new status across every view and the
  dashboards recompute

### Requirement: Delivery (envíos) management
The system SHALL let the encargado assign pending orders to a driver and SHALL
let the driver register the outcome of each delivery.

#### Scenario: Assign a driver
- **WHEN** the encargado assigns a driver to a confirmed order
- **THEN** a delivery for that driver's route is created and the order moves to
  "en camino"

#### Scenario: Register delivery outcome
- **WHEN** the driver marks a delivery as entregado (with collection method) or
  no entregado (with a reason)
- **THEN** the delivery and its order update, and the driver's route progress
  advances
