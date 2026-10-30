# KampusKart UI/UX Design Standards

## Overview
This document defines the design system and UI/UX standards for the KampusKart application to ensure consistency across all pages and components.

---

## 1. Color Palette

### Primary Colors
- **Dark Primary**: `#181818` - Main buttons, headers, primary actions
- **Accent/Hover**: `#00C6A7` (Teal) - Hover states, focus rings, active states
- **Secondary**: `#F05A25` (Orange) - Delete buttons, warnings, destructive actions

### Status Colors
- **Success/Resolved**: `bg-green-100 text-green-800`
- **Error/Lost**: `bg-red-100 text-red-800`
- **Warning/Pending**: `bg-yellow-100 text-yellow-800`
- **Info/In Progress**: `bg-blue-100 text-blue-800`
- **Neutral/Completed**: `bg-gray-100 text-gray-800`

### Background Colors
- **Page Background**: `bg-white`
- **Card Background**: `bg-white`
- **Input Background**: `bg-white`
- **Disabled Background**: `bg-gray-100`
- **Hover Background**: `bg-gray-50`

### Border Colors
- **Default Border**: `border-gray-200` with `border-2`
- **Hover Border**: `border-gray-300`
- **Focus Border**: `border-[#00C6A7]` with `ring-2 ring-[#00C6A7]`
- **Error Border**: `border-red-400`

### Text Colors
- **Primary Text**: `text-gray-900`
- **Secondary Text**: `text-gray-600`
- **Tertiary Text**: `text-gray-500`
- **Disabled Text**: `text-gray-400`
- **Error Text**: `text-red-500`

---

## 2. Typography

### Font Family
- **Primary Font**: `Work Sans` (loaded from Google Fonts)
- **Fallback**: `font-sans` (system font stack)

### Font Sizes & Weights

#### Headings
- **Page Title (H1)**: `text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900`
- **Section Title (H2)**: `text-xl sm:text-2xl font-bold text-gray-900`
- **Card Title (H3)**: `text-lg sm:text-xl font-bold text-gray-900`
- **Modal Title**: `text-xl sm:text-2xl font-bold text-gray-900`

#### Body Text
- **Large Body**: `text-base sm:text-lg text-gray-700`
- **Regular Body**: `text-sm sm:text-base text-gray-600`
- **Small Body**: `text-xs sm:text-sm text-gray-500`

#### Labels & Meta
- **Form Label**: `text-sm font-semibold text-gray-700`
- **Field Label**: `text-xs font-semibold text-gray-500`
- **Meta Info**: `text-xs text-gray-500`
- **Status Badge**: `text-xs font-medium`

#### Buttons
- **Primary Button**: `text-sm sm:text-base font-bold`
- **Secondary Button**: `text-sm font-semibold`
- **Icon Button**: `text-sm font-medium`

---

## 3. Spacing & Layout

### Container Padding
```css
container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24
```
- **Mobile**: `px-4 py-8 pt-24` (24 = navbar height offset)
- **Tablet**: `px-6`
- **Desktop**: `px-8`

### Card Padding
```css
p-4 sm:p-5 md:p-6
```
- **Mobile**: `p-4`
- **Tablet**: `p-5`
- **Desktop**: `p-6`

### Modal Padding
```css
p-4 sm:p-6 md:p-8
```
- **Mobile**: `p-4`
- **Tablet**: `p-6`
- **Desktop**: `p-8`

### Grid Gaps
```css
gap-4 sm:gap-5 lg:gap-6
```
- **Mobile**: `gap-4`
- **Tablet**: `gap-5`
- **Desktop**: `gap-6`

### Section Spacing
- **Between Sections**: `mb-8` or `space-y-8`
- **Between Elements**: `mb-4` or `space-y-4`
- **Between Small Elements**: `mb-2` or `space-y-2`

---

## 4. Border Radius

### Standard Sizes
- **Small**: `rounded-sm` (2px) - Rarely used
- **Medium**: `rounded-md` (6px) - Badges, small elements
- **Large**: `rounded-lg` (8px) - Cards, buttons, inputs (DEFAULT)
- **Extra Large**: `rounded-xl` (12px) - Modals, large containers
- **Full**: `rounded-full` - Avatars, pills, circular buttons

### Component-Specific
- **Cards**: `rounded-lg`
- **Buttons**: `rounded-lg`
- **Inputs**: `rounded-lg`
- **Modals**: `rounded-t-xl sm:rounded-xl` (mobile bottom sheet)
- **Badges**: `rounded-lg`
- **Avatars**: `rounded-full`

---

## 5. Button Styles

### Primary Button
```tsx
className="px-4 sm:px-6 py-3 sm:py-3.5 bg-[#181818] text-white font-bold text-sm sm:text-base rounded-lg hover:bg-[#00C6A7] active:bg-[#181818] transition-colors duration-200 flex items-center justify-center gap-2"
```

### Secondary Button
```tsx
className="px-4 sm:px-6 py-3 sm:py-3.5 bg-white text-gray-700 font-semibold text-sm sm:text-base rounded-lg border-2 border-gray-200 hover:bg-gray-50 active:bg-white transition-colors duration-200 flex items-center justify-center gap-2"
```

### Destructive Button
```tsx
className="px-4 sm:px-6 py-3 sm:py-3.5 bg-[#F05A25] text-white font-bold text-sm sm:text-base rounded-lg hover:bg-red-600 active:bg-[#F05A25] transition-colors duration-200 flex items-center justify-center gap-2"
```

### Icon Button
```tsx
className="p-2 sm:p-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:bg-gray-50 active:bg-white transition-colors duration-200 flex items-center justify-center"
```

### Disabled State
```tsx
disabled={true}
className="... opacity-50 cursor-not-allowed"
```

---

## 6. Form Input Styles

### Text Input
```tsx
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6A7] focus:border-transparent transition-all duration-200"
```

### Textarea
```tsx
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00C6A7] focus:border-transparent transition-all duration-200 resize-none"
rows={4}
```

### Select Dropdown
```tsx
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00C6A7] focus:border-transparent transition-all duration-200 appearance-none"
```

### Error State
```tsx
className="... border-red-400 focus:ring-red-400"
```

### Disabled State
```tsx
disabled={true}
className="... bg-gray-100 text-gray-400 cursor-not-allowed"
```

---

## 7. Card Layouts

### Standard Card (3-column grid)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
  <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors duration-200">
    {/* Image Section */}
    <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
      <img src="..." alt="..." className="w-full h-full object-cover" />
    </div>
    
    {/* Content Section */}
    <div className="p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">Title</h2>
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">Description</p>
      
      {/* Meta Info */}
      <div className="space-y-3 pt-4 border-t-2 border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Icon className="mr-2 flex-shrink-0" />
          <span>Meta info</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 4-Column Card (LostFound, Complaints)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
  {/* Same card structure as above */}
</div>
```

---

## 8. Modal Styles

### Full Modal Structure
```tsx
<div 
  className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4"
  onClick={onClose}
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div 
    className="bg-white rounded-t-xl sm:rounded-xl w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-4 sm:p-6 flex items-center justify-between z-10">
      <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-900">Modal Title</h2>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <FiX className="w-5 h-5 text-gray-500" />
      </button>
    </div>
    
    {/* Content */}
    <div className="p-4 sm:p-6 md:p-8">
      {/* Modal content */}
    </div>
    
    {/* Footer (optional) */}
    <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 justify-end">
      <button className="...">Cancel</button>
      <button className="...">Confirm</button>
    </div>
  </div>
</div>
```

---

## 9. Status Badges

### Badge Structure
```tsx
<span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-{color}-100 text-{color}-800 border-2 border-{color}-200">
  <Icon className="w-3 h-3 mr-1.5" /> 
  Status Text
</span>
```

### Status Colors
- **Success**: `bg-green-100 text-green-800 border-green-200`
- **Error**: `bg-red-100 text-red-800 border-red-200`
- **Warning**: `bg-yellow-100 text-yellow-800 border-yellow-200`
- **Info**: `bg-blue-100 text-blue-800 border-blue-200`
- **Neutral**: `bg-gray-100 text-gray-800 border-gray-200`

---

## 10. Loading States

### Page Loading
Use `PageSkeleton` component:
```tsx
{isLoading ? (
  <PageSkeleton 
    showHeader={true}
    showFilters={true}
    filterCount={2}
    contentType="cards"
    itemCount={6}
    showAddButton={true}
  />
) : (
  // Actual content
)}
```

### Button Loading
```tsx
<button disabled={isLoading} className="...">
  {isLoading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
      <span>Loading...</span>
    </>
  ) : (
    <>
      <Icon className="w-4 h-4" />
      <span>Button Text</span>
    </>
  )}
</button>
```

### Inline Loading
```tsx
<div className="flex items-center justify-center py-8">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C6A7]" />
</div>
```

---

## 11. Error States

### Page-Level Error
```tsx
<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
  <div className="flex items-start gap-3">
    <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
    <div>
      <h3 className="text-sm font-semibold text-red-800 mb-1">Error Title</h3>
      <p className="text-sm text-red-700">{errorMessage}</p>
    </div>
  </div>
</div>
```

### Field-Level Error
```tsx
<div className="mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-1">Field Label</label>
  <input 
    className={`... ${error ? 'border-red-400' : 'border-gray-200'}`}
  />
  {error && (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <FiAlertCircle className="w-3 h-3" />
      {error}
    </p>
  )}
</div>
```

---

## 12. Empty States

### Standard Empty State
```tsx
<div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
  <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6 text-gray-300">
    <Icon className="w-full h-full" />
  </div>
  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Items Found</h3>
  <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md">
    Description of empty state
  </p>
  <button className="...">
    <FiPlus className="w-4 h-4" />
    <span>Add New Item</span>
  </button>
</div>
```

---

## 13. Responsive Breakpoints

### Tailwind Breakpoints
- **Mobile**: `< 640px` (default, no prefix)
- **Tablet**: `sm: >= 640px`
- **Desktop**: `md: >= 768px`
- **Large Desktop**: `lg: >= 1024px`
- **Extra Large**: `xl: >= 1280px`

### Grid Layouts
- **3-column**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **4-column**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **2-column**: `grid-cols-1 md:grid-cols-2`

### Flex Direction
- **Stack on mobile**: `flex-col md:flex-row`
- **Always row**: `flex-row`
- **Always column**: `flex-col`

---

## 14. Accessibility

### ARIA Labels
- All icon buttons must have `aria-label`
- Modals must have `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Forms must have proper `<label>` elements with `htmlFor`
- Alerts must have `role="alert"`, `aria-live="polite"`

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Modals must close on `Escape` key
- Focus states must be visible: `focus:ring-2 focus:ring-[#00C6A7]`

### Semantic HTML
- Use proper heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
- Use `<button>` for interactive elements, not `<div>`
- Use `<form>` for forms with `<input>`, `<label>`, `<button type="submit">`

---

## 15. Animations & Transitions

### Standard Transitions
```css
transition-colors duration-200
transition-all duration-200
```

### Hover Effects
- **Buttons**: `hover:bg-[#00C6A7]`
- **Cards**: `hover:border-gray-300`
- **Links**: `hover:text-[#00C6A7]`

### Active States
- **Buttons**: `active:bg-[#181818]`
- **Cards**: `active:bg-gray-50`

### Loading Animations
- **Spinner**: `animate-spin`
- **Pulse**: `animate-pulse`

---

## 16. Image Handling

### Card Images
```tsx
<div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
  {imageUrl ? (
    <img 
      src={imageUrl} 
      alt={title} 
      className="w-full h-full object-cover" 
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center text-gray-300">
        <Icon className="w-16 h-16" />
        <span className="text-xs mt-2">No Image Available</span>
      </div>
    </div>
  )}
</div>
```

### Avatar Images
```tsx
<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
  {avatarUrl ? (
    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <FiUser className="w-6 h-6 text-gray-400" />
    </div>
  )}
</div>
```

---

## 17. Search & Filters

### Search Bar
```tsx
<div className="relative w-full sm:w-[380px] md:w-[440px] lg:w-[520px]">
  <div className="relative w-full rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 focus-within:ring-2 focus-within:ring-[#00C6A7] focus-within:border-transparent transition-all duration-200 flex items-center">
    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    <input
      type="text"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search..."
      className="flex-1 pl-12 pr-3 py-3.5 bg-transparent text-gray-700 font-medium outline-none text-base border-none placeholder:text-gray-400 rounded-l-lg"
    />
    <button
      type="button"
      onClick={handleSearch}
      className="px-6 py-3.5 bg-[#181818] text-white font-bold text-sm hover:bg-[#00C6A7] active:bg-[#181818] flex items-center justify-center gap-2 transition-all duration-200 border-l-2 border-gray-200 rounded-r-lg rounded-l-none"
    >
      <FiSearch className="w-4 h-4" />
      <span className="hidden sm:inline">Search</span>
    </button>
  </div>
</div>
```

### Filter Dropdown
```tsx
<select 
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00C6A7] focus:border-transparent transition-all duration-200"
>
  <option value="all">All Items</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

---

## 18. Footer

### Standard Footer
```tsx
<Footer
  socialLinks={socialLinks}
  quickLinks={[
    { href: '/events', label: 'Events' },
    { href: '/news', label: 'News' },
    { href: '/lostfound', label: 'Lost & Found' },
    { href: '/facilities', label: 'Facilities' },
    { href: '/campus-map', label: 'Map' },
  ]}
  legalLinks={[
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ]}
  copyright={{
    text: `© ${new Date().getFullYear()} KampusKart`,
    license: 'All rights reserved.',
  }}
/>
```

---

## 19. Best Practices

### Performance
- Use `React.lazy()` for code splitting
- Implement debouncing for search inputs (500ms)
- Use `useMemo()` and `useCallback()` for expensive computations
- Optimize images (WebP format, proper sizing)

### Security
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all API calls
- Implement rate limiting on forms

### Accessibility
- Maintain proper heading hierarchy
- Provide alt text for all images
- Ensure keyboard navigation works
- Test with screen readers

### Code Quality
- Follow consistent naming conventions
- Use TypeScript for type safety
- Write reusable components
- Document complex logic

---

## 20. Component Checklist

Before deploying a new component, ensure:

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading state with skeleton loader
- [ ] Error state with proper error message
- [ ] Empty state with helpful message
- [ ] Proper validation on forms
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Consistent styling (colors, fonts, spacing)
- [ ] Proper TypeScript types
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers

---

## Conclusion

Following these standards ensures a consistent, professional, and accessible user experience across the entire KampusKart application. All new components and features should adhere to these guidelines.

For questions or suggestions, please contact the development team.
