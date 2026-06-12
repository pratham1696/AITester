// Mock Jira Issues for offline testing, demos, and fallbacks.

const MOCK_ISSUES = {
  'LOGIN-101': {
    key: 'LOGIN-101',
    summary: 'Implement Two-Factor Authentication (2FA) & Reset Password on Login Page',
    description: `### User Story
As a registered customer, I want to securely log in using my username, password, and a temporary 6-digit 2FA code from an authenticator app, and be able to reset my password securely if I forget it, so that my personal details and billing info remain secure.

### Functional Requirements
1. **Login Form**:
   - Email field with client-side pattern validation (standard RFC email format, case-insensitive).
   - Password field (min 8 characters, must contain 1 uppercase letter, 1 number, and 1 special character).
   - "Remember Me" checkbox: if checked, persists a secure session token via HttpOnly cookies for 30 days.

2. **Multi-Factor Authentication (MFA)**:
   - When a user submits correct credentials, prompt them on a secondary screen to enter a 6-digit TOTP validation code from an authenticator app (Google Authenticator, Authy, etc.).
   - Code validation must happen within a 30-second window.
   - Support a "Resend Code / Lockout Bypass" backup flow using an email-based recovery link if the authenticator app is unavailable.

3. **Account Lockout (Security)**:
   - Lockout account temporarily for 15 minutes after 5 consecutive failed login or 2FA attempts.
   - Log failed attempts with IP address and timestamp in security audit log.

4. **Forgot / Reset Password**:
   - "Forgot Password" link triggers an email containing a secure tokenized link.
   - The token must be valid for exactly 1 hour.
   - Accessing the link displays a secure "New Password" screen matching password strength requirements.

### Technical & Compatibility
- Must redirect user to the user dashboard page (\`/dashboard\`) upon successful validation.
- Must run seamlessly across Chrome, Firefox, Safari, Edge, iOS Safari, and Android Chrome.
- All network calls must be encrypted over HTTPS. Set cookie flags: \`Secure\`, \`HttpOnly\`, \`SameSite=Strict\`.`,
    issueType: 'Story',
    status: 'In Progress',
    priority: 'High',
    components: ['Authentication', 'Frontend', 'Security'],
    labels: ['mfa', 'auth', 'security', 'v2-login'],
    fixVersions: ['v2.4.0'],
    reporter: 'Prathamesh Dhakane',
    assignee: 'Antigravity AI',
  },

  'DASH-202': {
    key: 'DASH-202',
    summary: 'Develop Executive Analytics Dashboard with Real-Time Widgets & CSV/PDF Export',
    description: `### User Story
As an executive or marketing manager, I want an interactive, real-time analytics dashboard showing core business metrics (revenue, active users, conversion rate) with configurable grid layouts and export features, so I can make data-driven decisions on our live marketing campaigns.

### Functional Requirements
1. **Custom Grid Widgets**:
   - Provide 4 default KPI cards: Revenue, Daily Active Users (DAU), Conversion Rate (%), and Bounce Rate (%).
   - Widgets must be draggable and resizable using a grid layout system.
   - Each widget must support displaying a sparkline chart of the past 24 hours.

2. **Real-time Live Refresh**:
   - Connect dashboard cards to a WebSocket server stream to refresh indicators automatically every 30 seconds.
   - Include a manual "Sync Now" button that triggers an API fetch to pull the latest cache immediately.
   - Gracefully display a status indicator: "Live" (Green) or "Disconnected / Offline Backup" (Orange).

3. **Date Range Filter**:
   - Provide a date range picker supporting: Today, Last 7 Days, Last 30 Days, Year-to-Date, and Custom Range.
   - Changing the date range must update all widgets instantly with smooth CSS loading transitions.

4. **Data Grid & Export**:
   - Render a table showing detailed log entries for conversions.
   - Support column sorting (Date, Campaign, Customer, Value) and multi-field search.
   - Add "Export to CSV" and "Export to PDF" options. The PDF report must follow corporate branding, including logo and execution timestamp.

### Non-Functional & Compatibility
- Dashboard must load in less than 1.5 seconds on desktop connections.
- Dashboard must render perfectly on iPad Landscape (1024x768) and standard Desktop (1920x1080).
- Keep data grid client-side memory footprint small by implementing server-side pagination (25 records per page).`,
    issueType: 'Story',
    status: 'Ready for Dev',
    priority: 'Critical',
    components: ['Dashboard', 'Analytics', 'Reporting'],
    labels: ['performance', 'ws', 'export', 'v2-dashboard'],
    fixVersions: ['v2.5.0'],
    reporter: 'Prathamesh Dhakane',
    assignee: 'Antigravity AI',
  },

  'VWO-48': {
    key: 'VWO-48',
    summary: 'Implement Multi-Tiered Checkout & Dynamic Discount Code Application',
    description: `### User Story
As a shopper, I want to apply discount codes during checkout and see my order total update dynamically, with correct tier discount rules applied automatically, so I get the correct promotion price.

### Functional Requirements
1. **Dynamic Coupon Code Entry**:
   - Add input field in the Checkout summary page labeled "Promo Code".
   - Validate coupons via \`POST /api/checkout/apply-coupon\` on change/submit.
   - Support coupon codes: \`SAVE20\` (20% off), \`FLAT50\` ($50 off orders over $200), \`FREESHIP\` (removes shipping cost).

2. **Tier-based Rules**:
   - Tier 1: Orders < $100 get standard coupon discounts.
   - Tier 2: Orders $100 - $250 get an automatic additional 5% loyalty discount at checkout.
   - Tier 3: Orders > $250 get free shipping automatically + 10% loyalty discount, even without promo code entry.

3. **Error Handling**:
   - Display clear red banner messages for invalid, expired, or threshold-unreached coupons.
   - Prevent stackable coupons unless the checkout campaign rule is explicitly flag-enabled.

4. **Pricing Refresh**:
   - Re-calculate subtotal, tax (based on zip code), shipping, coupon discount, and order total dynamically in the DOM.`,
    issueType: 'Bug Fix / Improvement',
    status: 'In Progress',
    priority: 'High',
    components: ['Checkout', 'Billing'],
    labels: ['coupons', 'checkout', 'promotions'],
    fixVersions: ['v3.1.0'],
    reporter: 'Prathamesh Dhakane',
    assignee: 'Antigravity AI',
  },
};

export function getMockIssue(key) {
  const normKey = (key || '').trim().toUpperCase();
  return MOCK_ISSUES[normKey] || MOCK_ISSUES['VWO-48'];
}
