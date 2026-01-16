# Workbenches Page - PatternFly Guidelines Review

## Summary
This document identifies PatternFly guideline violations in the Workbenches component that need to be addressed to align with PatternFly v6 standards.

## Critical Issues

### 1. Legacy PatternFly v5 Design Tokens
**Location:** Lines 1541, 2335
**Issue:** Using `--pf-v5-global--*` tokens instead of v6 semantic tokens
**Fix:** Replace with v6 semantic tokens:
- `--pf-v5-global--primary-color--100` → `--pf-t--global--text--color--link`
- `--pf-v5-global--danger-color--100` → `--pf-t--global--text--color--danger`
- `--pf-v5-global--disabled-color--100` → `--pf-t--global--text--color--disabled`

### 2. Hardcoded Spacing Values
**Issue:** Multiple instances of hardcoded spacing instead of design tokens
**Locations:**
- Line 1074: `marginTop: '0.25rem'` → Use `var(--pf-t--global--spacer--xs)`
- Line 1403: `columnGap: '16px'` → Use `var(--pf-t--global--spacer--md)`
- Line 1417: `marginRight: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`
- Line 1571: `marginBottom: '16px'` → Use `var(--pf-t--global--spacer--md)`
- Line 1620: `marginTop: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`
- Line 1836: `marginBottom: '0.75rem'` → Use `var(--pf-t--global--spacer--md)`
- Line 1980: `marginTop: '1rem'` → Use `var(--pf-t--global--spacer--md)`
- Line 2018: `marginBottom: '0.75rem'` → Use `var(--pf-t--global--spacer--md)`
- Line 2150: `marginTop: '1rem'` → Use `var(--pf-t--global--spacer--md)`
- Line 2201: `marginTop: '8px'` → Use `var(--pf-t--global--spacer--sm)`
- Line 2360: `marginBottom: '16px'` → Use `var(--pf-t--global--spacer--md)`
- Line 2397: `marginTop: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`
- Line 2706: `marginBottom: '16px'` → Use `var(--pf-t--global--spacer--md)`
- Line 2743: `marginTop: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`
- Line 2805: `marginTop: '4px'` → Use `var(--pf-t--global--spacer--xs)`
- Line 2811: `marginTop: '4px'` → Use `var(--pf-t--global--spacer--xs)`
- Line 2867: `marginBottom: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`

### 3. Hardcoded Colors
**Issue:** Using hardcoded hex colors instead of design tokens
**Locations:**
- Line 1792: `backgroundColor: '#f0f0f0'` → Use `var(--pf-t--global--background--color--secondary--default)`
- Line 1830: `backgroundColor: '#f5f5f5'` → Use `var(--pf-t--global--background--color--secondary--default)`
- Line 1833: `backgroundColor: '#fff'` → Use `var(--pf-t--global--background--color--primary--default)`
- Line 1833: `borderLeft: '3px solid #06c'` → Use `var(--pf-t--global--border--color--default)` and design token for width
- Line 1833: `marginRight: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`
- Line 2015: `backgroundColor: '#e6f3ff'` → Use `var(--pf-t--global--background--color--info--default)` or appropriate semantic color
- Line 2015: `borderLeft: '3px solid #0066cc'` → Use design tokens
- Line 2015: `marginLeft: '0.5rem'` → Use `var(--pf-t--global--spacer--sm)`

### 4. Hardcoded Font Sizes
**Issue:** Using hardcoded font sizes instead of design tokens
**Locations:**
- Line 1075: `fontSize: '0.75rem'` → Use `var(--pf-t--global--font--size--sm)`
- Line 2506: `fontSize: '0.875rem'` → Use `var(--pf-t--global--font--size--md)`

### 5. Inline Styles for Layout (Should Use Component Composition)
**Issue:** Using inline styles with Flex/div instead of Stack component
**Locations:**
- Lines 1385-1390: Header section uses inline Flex styles - Should use Stack component
- Lines 1830-1833: Expandable row sections use inline styles - Should use Card or proper component composition
- Lines 2015-2018: Similar expandable row styling issues

### 6. Missing Stack Component Usage
**Issue:** Not using Stack component for vertical spacing with hasGutter
**Recommendation:** Replace inline style divs with Stack component where appropriate, especially for:
- Header sections (Title + Content)
- Expandable row content sections
- Filter sections

### 7. Toolbar Styling
**Location:** Line 1403
**Issue:** Using inline style for Toolbar spacing
**Fix:** Use Toolbar props or remove if default spacing is sufficient

### 8. Missing Unique IDs
**Issue:** Some components may be missing unique IDs (per PatternFly rules)
**Status:** Most components have IDs, but should verify all interactive elements have unique IDs

## Recommended Fixes Priority

### High Priority
1. Replace all `--pf-v5-*` tokens with v6 semantic tokens
2. Replace all hardcoded spacing values with design tokens
3. Replace hardcoded colors with design tokens
4. Replace hardcoded font sizes with design tokens

### Medium Priority
5. Replace inline layout styles with Stack component where appropriate
6. Use Card components for expandable row sections instead of divs with inline styles
7. Remove unnecessary inline styles from Toolbar

### Low Priority
8. Verify all interactive elements have unique IDs
9. Consider using ActionGroup for button groups instead of Flex

## PatternFly v6 Design Token Reference

### Spacing Tokens
- `--pf-t--global--spacer--xs` (4px)
- `--pf-t--global--spacer--sm` (8px)
- `--pf-t--global--spacer--md` (16px)
- `--pf-t--global--spacer--lg` (24px)
- `--pf-t--global--spacer--xl` (32px)

### Color Tokens
- `--pf-t--global--text--color--regular`
- `--pf-t--global--text--color--link`
- `--pf-t--global--text--color--danger`
- `--pf-t--global--text--color--disabled`
- `--pf-t--global--background--color--primary--default`
- `--pf-t--global--background--color--secondary--default`
- `--pf-t--global--border--color--default`

### Font Size Tokens
- `--pf-t--global--font--size--xs`
- `--pf-t--global--font--size--sm`
- `--pf-t--global--font--size--md`
- `--pf-t--global--font--size--lg`

## Component Composition Recommendations

### Use Stack for Vertical Layout
```jsx
// Instead of:
<div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
  <Title>...</Title>
  <Content>...</Content>
</div>

// Use:
<Stack hasGutter>
  <Title>...</Title>
  <Content>...</Content>
</Stack>
```

### Use Card for Expandable Sections
```jsx
// Instead of:
<div style={{ padding: '1rem', backgroundColor: '#fff', borderLeft: '3px solid #06c' }}>
  ...
</div>

// Use:
<Card>
  <CardBody>
    ...
  </CardBody>
</Card>
```
