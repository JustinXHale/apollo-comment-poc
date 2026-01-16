# PatternFly Guidelines Review - Workbenches Page

## Overview
Comprehensive review of `/develop-train/workbenches` page (all tabs) against PatternFly v6 guidelines and standards.

## Critical Issues

### 1. Legacy v5 Class References (Lines 2152-2157)
**Issue**: Using v5 class names in row click handler
```typescript
// ❌ Current (v5 classes)
const isCheckbox = target.closest('.pf-v5-c-table__check');
const isExpandArrow = target.closest('.pf-v5-c-table__toggle');
const isKebab = target.closest('.pf-v5-c-menu-toggle') || 
               target.closest('.pf-v5-c-dropdown') ||
               target.closest('.pf-v5-c-table__action');
```

**Fix**: Use v6 classes or better approach - use data attributes or component refs
```typescript
// ✅ Better approach - use data attributes or refs
const isCheckbox = target.closest('input[type="checkbox"]') || 
                  target.closest('[data-ouia-component-type="PF4/TableCheckbox"]');
const isExpandArrow = target.closest('button[aria-label*="expand"]') ||
                     target.closest('[data-ouia-component-type="PF4/TableExpand"]');
const isKebab = target.closest('[data-ouia-component-type="PF4/Dropdown"]') ||
               target.closest('[data-ouia-component-type="PF4/MenuToggle"]');
```

### 2. Hardcoded Values in Inline Styles
**Issue**: Using hardcoded `'0px'` values instead of tokens or removing unnecessary styles

**Locations:**
- Line 1785: `paddingBottom: '0px'` in Toolbar style
- Line 1978: `marginTop: '0px'` in filter chips container

**Fix**: Remove hardcoded values or use tokens
```typescript
// ❌ Current
style={{ columnGap: 'var(--pf-t--global--spacer--md)', paddingBottom: '0px' }}
style={{ marginBottom: 'var(--pf-t--global--spacer--md)', marginTop: '0px' }}

// ✅ Fixed - Remove unnecessary '0px' values
style={{ columnGap: 'var(--pf-t--global--spacer--md)' }}
style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
```

### 3. Icon Inline Styles (Line 1799)
**Issue**: Icon spacing using inline style instead of component props
```typescript
// ❌ Current
icon={<FilterIcon style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }} />}

// ✅ Fixed - Use InputGroup spacing or remove if not needed
icon={<FilterIcon />}
// Or wrap in Flex with spacing
<Flex spaceItems={{ default: 'spaceItemsSm' }}>
  <FlexItem><FilterIcon /></FlexItem>
  <FlexItem>Filter text</FlexItem>
</Flex>
```

### 4. PageSection Structure
**Issue**: Some PageSections may need `hasBodyWrapper` prop for proper spacing

**Locations to check:**
- Line 1784: `PageSection id="workbenches-content-section"` - Should have `hasBodyWrapper` if it contains main content
- Line 3065: `PageSection` for Workspace Templates toolbar - May need `hasBodyWrapper`
- Line 3498: `PageSection` for Archive toolbar - May need `hasBodyWrapper`

**Fix**: Add `hasBodyWrapper` where appropriate
```typescript
// ✅ Correct
<PageSection id="workbenches-content-section" hasBodyWrapper>
```

### 5. Toolbar Inline Styles (Line 1785)
**Issue**: Using inline styles for Toolbar spacing instead of component props
```typescript
// ❌ Current
<Toolbar 
  id="workbenches-toolbar" 
  inset={{ default: 'insetNone' }} 
  style={{ columnGap: 'var(--pf-t--global--spacer--md)', paddingBottom: '0px' }}
>

// ✅ Fixed - Remove inline styles, use Toolbar props
<Toolbar 
  id="workbenches-toolbar" 
  inset={{ default: 'insetNone' }}
>
```

### 6. Button Inline Styles (Line 1862-1864)
**Issue**: Using inline style for conditional color instead of variant prop
```typescript
// ❌ Current
<Button
  variant="link"
  style={{
    color: selectedCount > 0 ? 'var(--pf-t--global--text--color--link)' : 'var(--pf-t--global--text--color--disabled)'
  }}
>

// ✅ Fixed - Use disabled prop or variant
<Button
  variant="link"
  isDisabled={selectedCount === 0}
>
```

### 7. Card Border Inline Style (Line 2282)
**Issue**: Using inline style for border instead of Card variant or proper styling
```typescript
// ❌ Current
<Card style={{ borderLeft: `3px solid var(--pf-t--global--text--color--link)`, marginRight: 'var(--pf-t--global--spacer--sm)' }}>

// ✅ Fixed - Use Card variant or proper composition
<Card>
  <CardBody>
    {/* Content */}
  </CardBody>
</Card>
// Or use Stack/Flex for spacing instead of marginRight
```

### 8. FlexItem Inline Styles (Line 1325, 2027)
**Issue**: Using inline styles for spacing instead of Flex props
```typescript
// ❌ Current
<FlexItem style={{ marginTop: 'var(--pf-t--global--spacer--xs)' }}>
<Button style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>

// ✅ Fixed - Use Flex spaceItems or Stack hasGutter
<Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
  <FlexItem>{renderPrimaryStatusLabel(record)}</FlexItem>
  <FlexItem>
    <Label>Legacy: {relatedWorkbench.status}</Label>
  </FlexItem>
</Flex>
```

### 9. Div Wrapper with Inline Styles (Line 1978, 2279)
**Issue**: Using div wrappers with inline styles instead of PatternFly layout components
```typescript
// ❌ Current
<div style={{ marginBottom: 'var(--pf-t--global--spacer--md)', marginTop: '0px' }}>
<div style={{ padding: 'var(--pf-t--global--spacer--md)', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)' }}>

// ✅ Fixed - Use Stack or PageSection
<Stack hasGutter>
  <LabelGroup>
    {/* Filter chips */}
  </LabelGroup>
</Stack>

<PageSection variant="secondary">
  <Flex>
    {/* Content */}
  </Flex>
</PageSection>
```

## Medium Priority Issues

### 10. Table Structure Verification
**Status**: ✅ Generally correct - using composable Table components
- Using `Table`, `Thead`, `Tbody`, `Tr`, `Th`, `Td` correctly
- Using `ActionsColumn` for kebab menus
- Proper sorting implementation

**Recommendation**: Verify all tables follow the same pattern across all tabs

### 11. Title and Content Usage
**Status**: ✅ Correct usage
- Using `Title` component with proper `headingLevel`
- Using `Content` with `component={ContentVariants.p}`
- Proper heading hierarchy maintained

### 12. Toolbar Structure
**Status**: ⚠️ Needs review
- Toolbar structure is correct
- Filter implementation follows PF patterns
- Consider using `ToolbarFilter` component for active filters display

### 13. Drawer Structure
**Status**: ✅ Correct
- Using `Drawer`, `DrawerContent`, `DrawerPanelContent`, `DrawerPanelBody` correctly
- Proper use of `DrawerHead` and `DrawerActions`
- Tabs properly structured inside drawer

## Design Token Usage Review

### ✅ Good Token Usage
- Spacing: Using `var(--pf-t--global--spacer--{size})` correctly
- Colors: Using semantic color tokens like `var(--pf-t--global--text--color--link)`
- Typography: Using `var(--pf-t--global--font--size--sm)` correctly

### ⚠️ Areas for Improvement
- Remove hardcoded `'0px'` values
- Replace inline styles with component props where possible
- Use `Stack hasGutter` instead of manual margin spacing

## Accessibility Review

### ✅ Good Practices
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly structure

### ⚠️ Areas to Verify
- Ensure all interactive elements have proper ARIA labels
- Verify focus management in drawers
- Check table sorting accessibility

## Summary of Required Fixes

### High Priority
1. Replace v5 class references with v6 classes or data attributes
2. Remove hardcoded `'0px'` values from inline styles
3. Replace icon inline styles with component composition
4. Add `hasBodyWrapper` to PageSections where needed

### Medium Priority
5. Replace Button inline color styles with variant/disabled props
6. Replace Card border inline styles with proper composition
7. Replace FlexItem inline spacing with Flex spaceItems
8. Replace div wrappers with Stack/PageSection components

### Low Priority
9. Review Toolbar structure for optimization
10. Verify all tables follow consistent patterns

## PatternFly Token Reference

When fixing inline styles, use these tokens:
- **Spacing**: `var(--pf-t--global--spacer--{xs|sm|md|lg|xl})`
- **Colors**: `var(--pf-t--global--text--color--{regular|subtle|link|disabled})`
- **Background**: `var(--pf-t--global--background--color--{primary|secondary}--default)`
- **Typography**: `var(--pf-t--global--font--size--{sm|md|lg})`

## Next Steps

1. Fix all high priority issues
2. Review and fix medium priority issues
3. Test all tabs for consistency
4. Verify responsive behavior
5. Test accessibility with screen readers
