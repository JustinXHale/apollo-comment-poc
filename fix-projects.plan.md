<!-- 9fc04a49-06ed-4ae6-a4d4-86c68c7ec308 12175ff7-bbe7-4e18-b827-16da71349d6d -->
# Fix Data Science Projects Page Visual Design

## File to Modify

`src/app/DataScienceProjects/DataScienceProjects.tsx`

## Changes Required

### 1. Import Changes

- Add `FolderIcon` import from `@patternfly/react-icons`
- Replace `CubesIcon` with `FolderIcon` in the page title

### 2. Project Name Link Styling

- Ensure project name links use proper PatternFly blue color (already using `var(--pf-v6-global--link--Color)`)
- Add text truncation for long project names using CSS or PatternFly truncate modifier

### 3. Expanded Workbench Section Styling

**Background and Spacing:**

- Add background color to `ExpandableRowContent` (light gray: `var(--pf-v6-global--BackgroundColor--200)`)
- Adjust padding in expanded section for better spacing
- Ensure proper vertical spacing between workbench rows

**Workbench Name Links:**

- Add external link icon to workbench names (matching production screenshots)
- Style links appropriately with proper colors

**Status Badges:**

- Ensure "Stopped" status uses filled `CircleIcon` (not outlined)
- Verify all status colors match production (grey, green, blue, red)

**Nested Table:**

- Remove or adjust table borders in nested workbench table
- Verify column alignment matches production

**Actions Column:**

- Ensure "Start"/"Stop" buttons align properly with kebab menu
- Position actions on the right side of the row

### 4. Add More Mock Projects

- Expand projects array from 8 to ~44 projects
- Use varied project names, owners, dates, and workbench counts
- Ensure realistic distribution of data for testing pagination

### 5. Visual Polish

- Verify row spacing in main table
- Test pagination displays "1 - 10 of 44" correctly
- Ensure all icons are properly sized and colored

### To-dos

- [x] Replace CubesIcon with FolderIcon in imports and page title
- [x] Add text truncation to project names with ellipsis
- [x] Update expanded workbench section styling (background, spacing, borders)
- [x] Add external link icons to workbench names (matching production screenshots)
- [x] Ensure status badges use correct filled/outlined icons
- [x] Add ~36 more projects to reach 44 total for realistic pagination
- [x] Test all visual changes match production screenshots

## Implementation Summary

All tasks have been completed:

1. **Icon Change**: Replaced `CubesIcon` with `FolderIcon` in page header
2. **Text Truncation**: Added CSS truncation for project names (400px) and descriptions (500px)
3. **Expanded Section**: Added gray background and proper padding to workbench section
4. **Workbench Links**: Added external link icons with gray color and proper sizing
5. **Status Badges**: Using correct CircleIcon with proper colors for all statuses
6. **Mock Data**: Expanded to 44 projects with realistic varied data
7. **Visual Polish**: All icons sized correctly, pagination shows "1 - 10 of 44", proper spacing throughout

The Data Science Projects page now matches production design exactly.

