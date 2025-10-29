# Comment Mode Testing Guide

## Quick Test Scenarios

### Scenario 1: Basic Comment Creation
**Goal**: Verify comment creation and auto-open popover

1. Start dev server: `npm run start:dev`
2. Open browser to `http://localhost:9000`
3. Check both checkboxes in toolbar:
   - ☑ Show Pins
   - ☑ Enable Commenting
4. **Observe**: Checkboxes turn **RED**, cursor becomes **crosshair**
5. Click anywhere on the Dashboard page
6. **Verify**: 
   - Red pin appears at click location
   - Popover opens automatically
   - Textarea is focused (you can type immediately)
7. Type: "Test comment 1"
8. Click outside popover
9. **Verify**: Popover closes, pin remains

**Expected Result**: ✅ Pin created with auto-open popover

---

### Scenario 2: Browse Mode (Read-Only)
**Goal**: Verify pins are visible but not interactive

1. From Scenario 1, leave pins on screen
2. **Uncheck** "Enable Commenting" (keep "Show Pins" checked)
3. **Observe**:
   - Cursor returns to normal
   - Pins are dimmed (60% opacity)
4. Try clicking a pin
5. **Verify**: Nothing happens (pin not clickable)
6. Try clicking the page
7. **Verify**: No new pin created

**Expected Result**: ✅ Browse mode works correctly

---

### Scenario 3: Hide All Comments
**Goal**: Verify Show Pins toggle removes all pins

1. From Scenario 2, with pins on screen
2. **Uncheck** "Show Pins"
3. **Observe**: All pins disappear immediately
4. **Check** "Show Pins" again
5. **Verify**: Pins reappear in same positions

**Expected Result**: ✅ Show/hide works correctly

---

### Scenario 4: Persistence Across Refresh
**Goal**: Verify localStorage persistence

1. Create 2-3 comments on Dashboard
2. Check localStorage in DevTools:
   - Open DevTools (F12)
   - Application/Storage tab
   - Local Storage → `http://localhost:9000`
   - Find keys:
     - `apollo-comments` (array of comments)
     - `apollo-show-pins` ("true" or "false")
     - `apollo-enable-commenting` ("true" or "false")
3. **Refresh the page** (F5)
4. **Verify**:
   - Pins reappear in same locations
   - Checkbox states preserved
   - Can click pins to see comment text

**Expected Result**: ✅ Full state persistence

---

### Scenario 5: Route-Specific Comments
**Goal**: Verify comments are filtered by route

1. Navigate to Dashboard (`/`)
2. Enable both toggles
3. Add comment: "Dashboard comment"
4. Navigate to a different page (e.g., "Data Science Projects")
5. **Observe**: Dashboard comment disappears
6. Add new comment: "Projects comment"
7. Navigate back to Dashboard
8. **Verify**: 
   - "Dashboard comment" is visible
   - "Projects comment" is NOT visible
9. Return to Data Science Projects page
10. **Verify**: "Projects comment" is visible again

**Expected Result**: ✅ Route filtering works correctly

---

### Scenario 6: Edit Existing Comment
**Goal**: Verify comment editing works

1. With "Enable Commenting" ON
2. Click an existing red pin
3. **Verify**: Popover opens with existing text
4. Modify the text: "Updated comment text"
5. Click outside popover
6. Click pin again
7. **Verify**: Text was saved ("Updated comment text" appears)

**Expected Result**: ✅ Editing persists

---

### Scenario 7: Delete Single Comment
**Goal**: Verify individual comment deletion

1. Click a pin to open popover
2. Find "Delete Pin" button (red, with X icon)
3. Click "Delete Pin"
4. **Verify**:
   - Popover closes
   - Pin disappears immediately
5. Refresh page
6. **Verify**: Pin does not reappear (localStorage updated)

**Expected Result**: ✅ Single deletion works

---

### Scenario 8: Clear All Comments
**Goal**: Verify bulk deletion

1. Create 3+ comments across different routes
2. Click user profile dropdown (top right)
3. **Verify**: "Clear all comments (X)" appears with count
4. Click "Clear all comments"
5. **Verify**: Browser confirm dialog appears
6. Click "Cancel" in dialog
7. **Verify**: Comments remain
8. Click "Clear all comments" again
9. Click "OK" in dialog
10. **Verify**: All pins disappear on all routes

**Expected Result**: ✅ Clear all with confirmation works

---

### Scenario 9: Multiple Routes with Multiple Comments
**Goal**: Stress test route filtering

1. Dashboard - Add 3 comments
2. Settings - Add 2 comments
3. Data Science Projects - Add 4 comments
4. Navigate between all three pages
5. **Verify** on each page:
   - Only that page's comments appear
   - Correct number of pins
   - No cross-contamination

**Expected Result**: ✅ Route isolation maintained

---

### Scenario 10: Toggle State Combinations
**Goal**: Test all toggle combinations

**Test A**: Both OFF
- Both unchecked
- No pins visible
- Normal cursor

**Test B**: Show ON, Commenting OFF
- Pins visible, dimmed
- Pins not clickable
- Normal cursor
- Cannot add new pins

**Test C**: Show OFF, Commenting ON
- No pins visible
- Crosshair cursor (but ineffective)
- Clicking creates pins but they're hidden

**Test D**: Both ON
- Pins visible, full opacity
- Pins clickable
- Crosshair cursor
- Can add new pins

**Expected Result**: ✅ All combinations work as designed

---

## Visual Checklist

### Checkboxes
- [ ] Checkboxes visible in top toolbar
- [ ] Checkboxes turn RED when checked
- [ ] Labels readable: "Show Pins" and "Enable Commenting"
- [ ] Checkboxes grouped together visually

### Pins
- [ ] Pins are bright red (#C9190B)
- [ ] Pins have white border and shadow
- [ ] Pins are circular
- [ ] Pins show comment icon
- [ ] Pins dimmed (60% opacity) when not interactive

### Cursor
- [ ] Crosshair when both toggles ON
- [ ] Normal cursor when commenting OFF
- [ ] Normal cursor when show pins OFF

### Popover
- [ ] Popover opens on pin click (when interactive)
- [ ] Popover opens automatically on pin creation
- [ ] Textarea auto-focused
- [ ] Timestamp visible
- [ ] "Delete Pin" button red and visible
- [ ] Popover closes on ESC
- [ ] Popover closes on outside click

### User Dropdown
- [ ] "Clear all comments (X)" visible when comments exist
- [ ] Count is accurate
- [ ] Hidden when no comments exist

---

## Browser DevTools Checks

### Console
- [ ] No JavaScript errors
- [ ] No warnings about missing keys
- [ ] No infinite render loops

### Network Tab
- [ ] No unnecessary API calls (should be none)
- [ ] No 404s or failed requests

### Application/Storage Tab
- [ ] `apollo-comments` updates on every change
- [ ] `apollo-show-pins` updates on toggle
- [ ] `apollo-enable-commenting` updates on toggle
- [ ] JSON format is valid

### Performance
- [ ] No lag when clicking to add pins
- [ ] No lag when opening popovers
- [ ] Smooth navigation between routes

---

## Regression Tests (Things That Should Still Work)

- [ ] Sidebar navigation works
- [ ] User profile dropdown works
- [ ] Theme toggle works (if enabled)
- [ ] All existing routes accessible
- [ ] No layout shifts from comment overlay
- [ ] Other localStorage items unaffected

---

## Edge Cases to Test

### Empty States
- [ ] Zero comments → no pins visible
- [ ] Zero comments → "Clear all" hidden
- [ ] New route with no comments → empty

### Rapid Interaction
- [ ] Click multiple pins quickly
- [ ] Toggle checkboxes rapidly
- [ ] Create many pins in succession
- [ ] Navigate routes quickly

### Text Edge Cases
- [ ] Very long comment text (500+ chars)
- [ ] Empty comment text
- [ ] Special characters in comments
- [ ] Emoji in comments 🎉
- [ ] Line breaks in comments

### Position Edge Cases
- [ ] Pins near top edge
- [ ] Pins near bottom edge
- [ ] Pins near left edge
- [ ] Pins near right edge
- [ ] Pins in scrollable content

---

## Known Issues (Expected Behavior)

1. **Window resize** - Pins may not reposition correctly (absolute positioning)
2. **Popover positioning** - May appear in different locations based on viewport space
3. **LocalStorage quota** - Very large comment sets may hit browser limits
4. **Private mode** - Comments won't persist in incognito/private browsing

---

## Bug Report Template

If you find issues, report with this format:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari + version]
**Console Errors**: [Any JS errors]
**Screenshot**: [If applicable]
```

---

## Success Criteria

All scenarios above should pass with ✅ marks.  
The implementation should feel:
- **Obvious** - Red pins and checkboxes make state clear
- **Reliable** - Actions have immediate, predictable results
- **Persistent** - Nothing lost on refresh
- **Route-aware** - Comments stay with their pages

This is a POC, so polish is not required. Functionality is the priority.

