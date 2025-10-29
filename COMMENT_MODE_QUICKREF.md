# Comment Mode Quick Reference Card

## 🎯 Three Modes

### 1. Full Commenting Mode
```
☑ Show Pins  +  ☑ Enable Commenting
```
- Pins visible, clickable
- Crosshair cursor
- Can add new pins
- Can edit/delete

### 2. Browse Mode (Read-Only)
```
☑ Show Pins  +  ☐ Enable Commenting
```
- Pins visible but dimmed
- Pins NOT clickable
- Normal cursor
- Cannot add new pins

### 3. Hidden
```
☐ Show Pins  +  ☐ Enable Commenting
```
- No pins visible
- Clean view

---

## 🔴 Visual Indicators

| Element | Appearance | Meaning |
|---------|-----------|---------|
| Red checkbox | Checked | Feature enabled |
| Red pin | Bright, solid | Pin visible and interactive |
| Dimmed pin | 60% opacity | Pin visible but NOT clickable |
| Crosshair cursor | ✝ | Full commenting mode active |
| Normal cursor | ↖ | Browse mode or disabled |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **ESC** | Close popover |
| **Tab** | Navigate checkboxes |
| **Space** | Toggle checkbox |
| **Click outside** | Close popover |

---

## 📍 Pin Actions

### Create Pin
1. Enable both toggles
2. Click anywhere
3. Popover opens automatically
4. Type and click outside

### Edit Pin
1. Enable both toggles
2. Click red pin
3. Modify text
4. Click outside

### Delete Pin
1. Click pin
2. Click "Delete Pin" button
3. Pin removed immediately

### Browse Pins
1. Enable "Show Pins" only
2. Pins visible but NOT clickable

---

## 🗑️ Clear All Comments

1. Click user dropdown (top right)
2. Select "Clear all comments (X)"
3. Confirm in browser dialog
4. All pins deleted on all routes

---

## 🗺️ Route Filtering

- Comments tied to route where created
- Dashboard pins stay on Dashboard
- Settings pins stay on Settings
- Each route has separate comments

**Test it:**
1. Add pin on Dashboard
2. Go to Settings
3. Dashboard pin disappears ✓
4. Add pin on Settings
5. Return to Dashboard
6. Settings pin NOT visible ✓

---

## 💾 localStorage Keys

```javascript
// Check in DevTools → Application → Local Storage
apollo-comments           // Array of all comments
apollo-show-pins          // "true" or "false"
apollo-enable-commenting  // "true" or "false"
```

---

## ✅ Quick Test

**30-Second Validation:**

1. ☑ Both toggles ON → Cursor crosshair ✓
2. Click screen → Red pin appears ✓
3. Popover auto-opens ✓
4. Type text, click outside ✓
5. ☐ Commenting OFF → Pin dimmed ✓
6. Click pin → Nothing happens ✓
7. ☐ Show Pins OFF → Pin hidden ✓
8. Refresh page → Pin reappears ✓

**If all ✓, it's working!**

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Pins not appearing | Check "Show Pins" is ON |
| Can't add pins | Enable "Enable Commenting" |
| Pins not clickable | Enable "Enable Commenting" |
| Pins don't persist | Check localStorage enabled (not private mode) |
| Wrong pins on route | Check comment's `.route` property |

---

## 🎨 Style Reference

```css
Pin color:       #C9190B (red)
Checkbox color:  #C9190B (red when checked)
Pin size:        32px circle
Pin border:      2px white
Pin shadow:      0 2px 8px rgba(0,0,0,0.3)
Dimmed opacity:  0.6 (60%)
```

---

## 📊 Toggle Truth Table

| Show | Comment | Pins Visible | Clickable | Can Add |
|------|---------|--------------|-----------|---------|
| 0    | 0       | No           | No        | No      |
| 0    | 1       | No           | No        | No      |
| 1    | 0       | Yes          | No        | No      |
| 1    | 1       | Yes          | Yes       | Yes     |

---

## 🔍 DevTools Checklist

**Console Tab:**
- [ ] No errors
- [ ] No warnings

**Network Tab:**
- [ ] No API calls (all local)

**Application Tab:**
- [ ] localStorage keys present
- [ ] JSON valid

**Performance:**
- [ ] No lag on click
- [ ] No lag on navigation

---

## 📝 Data Format Example

```json
{
  "id": "comment-1730235467123-xyz",
  "x": 450,
  "y": 300,
  "text": "Fix this button",
  "createdAt": "2025-10-29T15:04:27.123Z",
  "route": "/dashboard"
}
```

---

## 🚀 Start Testing

```bash
npm run start:dev
```

Open: **http://localhost:9000**

Look for two checkboxes in top toolbar:
- Show Pins
- Enable Commenting

**Check both → Click screen → See red pin → Done!**

---

**Print this card for quick reference during testing.**

