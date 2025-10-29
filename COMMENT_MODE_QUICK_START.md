# Comment Mode Quick Start Guide

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npm run start:dev
```

### 2. Open Your Browser
Navigate to `http://localhost:9000`

## 📝 How to Use Comment Mode

### Step 1: Enable Comment Mode
- Look at the top toolbar (masthead)
- Find the **comment icon button** (between the info icon and theme toggle)
- Click it to activate Comment Mode
- The button will turn **blue** to indicate it's active
- The page content will show a subtle **blue tint overlay**
- Your cursor will change to a **crosshair**

### Step 2: Place Comment Pins
- Click anywhere on the page content
- A circular **pin** will appear at your click location
- New pins are **orange** (empty, no text yet)
- Pins with text are **blue**

### Step 3: Add Comment Text
- Click any pin to open a popover
- Type your comment in the text area
- The pin automatically changes to **blue** when you add text
- The timestamp shows when the pin was created
- Click outside the popover or press **ESC** to close it

### Step 4: Delete Comments
- Open a pin's popover
- Click the red **Delete** button
- The pin is removed immediately

### Step 5: Toggle Comment Mode Off
- Click the comment icon button again
- The button returns to normal appearance
- The blue overlay disappears
- **Your pins remain visible** but you can't add new ones

### Step 6: Clear All Comments (Optional)
- Click your user profile in the top right
- Select "Clear all comments (X)" from the dropdown
- Confirm the deletion
- All pins are removed

## ✨ Features to Test

### Persistence
1. Add some comments
2. Refresh the page (F5)
3. ✅ Comments should reappear in the same locations

### Comment Mode State
1. Enable Comment Mode
2. Refresh the page
3. ✅ Comment Mode should still be active

### Visual Indicators
- 🟠 **Orange pins** = Empty, no text
- 🔵 **Blue pins** = Contains text
- 🔵 **Blue button** = Comment Mode active
- ⚪ **Gray button** = Comment Mode inactive

### Interaction
- Hover over pins → They scale up slightly
- Click pin → Opens popover
- Click overlay (not pin) → Creates new pin
- ESC key → Closes popover
- Tooltip on hover → Shows current state

## 🎯 What to Look For

### ✅ Success Indicators
- [x] Toggle button changes appearance when clicked
- [x] Overlay appears with blue tint when active
- [x] Crosshair cursor appears when active
- [x] Pins place exactly where you click
- [x] Popover opens when clicking a pin
- [x] Text saves automatically as you type
- [x] Pins change color when text is added
- [x] Comments persist after page refresh
- [x] Delete button removes pins
- [x] Clear all removes all pins with confirmation

### 🎨 Visual Check
- Pins should be **clearly visible** against any background
- Pins have **white borders** and **shadows** for depth
- Popovers should **auto-position** to stay in viewport
- No z-index conflicts (pins always on top)

## 📱 Browser Developer Tools

### Check localStorage
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** → `http://localhost:9000`
4. Look for keys:
   - `apollo-comments` → Array of comment objects
   - `apollo-comment-mode` → "true" or "false"

### Sample Data Structure
```json
[
  {
    "id": "comment-1730000000000-abc123",
    "x": 350,
    "y": 200,
    "text": "This is a test comment",
    "createdAt": "2025-10-29T12:34:56.789Z"
  }
]
```

## 🐛 Troubleshooting

### Pins not appearing
- ✓ Is Comment Mode active? (blue button)
- ✓ Are you clicking on the content area (not sidebar/header)?
- ✓ Check console for JavaScript errors

### Comments not persisting
- ✓ Is localStorage enabled in your browser?
- ✓ Not in private/incognito mode?
- ✓ Check localStorage in DevTools

### Popover not opening
- ✓ Click directly on the pin (not near it)
- ✓ Wait for pin hover animation to complete
- ✓ Try clicking a different pin

### Z-index issues
- ✓ Pins should always be clickable
- ✓ Overlay z-index is 999, pins are 1000
- ✓ Check for conflicting CSS

## 🎓 Developer Notes

### File Locations
- **Context**: `src/app/context/CommentContext.tsx`
- **Components**: `src/app/components/comments/`
- **Integration**: `src/app/index.tsx`, `src/app/AppLayout/AppLayout.tsx`

### Key Files Changed
- ✅ `src/app/index.tsx` - Added CommentProvider
- ✅ `src/app/AppLayout/AppLayout.tsx` - Added toggle button and overlay
- ✅ `src/app/context/CommentContext.tsx` - NEW
- ✅ `src/app/components/comments/CommentPin.tsx` - NEW
- ✅ `src/app/components/comments/CommentOverlay.tsx` - NEW

### No Breaking Changes
- ✅ No existing routes modified
- ✅ No existing components broken
- ✅ No new dependencies required
- ✅ Build passes without errors
- ✅ TypeScript type-safe

## 📚 Full Documentation
See `COMMENT_MODE.md` for complete technical documentation.

---

**Happy Testing! 🎉**

If you encounter any issues, check the browser console for errors or refer to the troubleshooting section above.

