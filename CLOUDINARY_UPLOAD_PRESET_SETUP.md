# 🔧 Cloudinary Upload Preset Setup

## 🚨 Issue: Widget Redirects Without Upload

The upload widget is redirecting back to the products page because the **upload preset doesn't exist** in your Cloudinary account.

## ✅ Solution: Create Upload Preset

### **Step 1: Access Cloudinary Dashboard**
1. Go to [https://cloudinary.com/console](https://cloudinary.com/console)
2. Log in with your account
3. Select your cloud: **dgyrfetyu**

### **Step 2: Create Upload Preset**
1. Navigate to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:

```
Preset name: akamba_handicraft
Signing Mode: Unsigned
Folder: akamba-handicraft/products
Auto-generate folder based on public ID: ✅
Use filename: ✅
Unique filename: ✅
```

### **Step 3: Advanced Settings**
```
Resource type: Image
Format: Auto
Quality: Auto
Eager transformations: 
  - w_800,h_800,c_fill,f_auto,q_auto
  - w_400,h_400,c_fill,f_auto,q_auto
  - w_200,h_200,c_fill,f_auto,q_auto

Access mode: Public
Use filename: ✅
Unique filename: ✅
```

### **Step 4: Save Preset**
1. Click **Save** to create the preset
2. The preset should now appear in your list

## 🔍 Alternative: Use Signed Upload

If you prefer not to create an upload preset, the widget will fallback to **signed upload** which requires your API credentials.

### **Environment Variables Required**
```bash
CLOUDINARY_API_KEY=572745581978517
CLOUDINARY_API_SECRET=MhhYh7bm4X-g-CZKsc-cvxlSd6Q
```

## 🧪 Test the Fix

1. **Create the upload preset** as described above
2. **Refresh your application**
3. **Try uploading an image**
4. **Check browser console** for widget events

### **Expected Console Output**
```
Widget event: show
Widget event: upload-added
Widget event: upload-progress
Widget event: upload-complete
Widget event: success
```

## 🚨 Common Issues

### **Issue 1: Preset Not Found**
```
Error: Upload preset 'akamba_handicraft' not found
```
**Solution**: Create the upload preset as described above

### **Issue 2: Unsigned Upload Not Allowed**
```
Error: Unsigned uploads not allowed
```
**Solution**: Enable unsigned uploads in Cloudinary settings

### **Issue 3: Widget Closes Immediately**
```
Widget event: show
Widget event: close
```
**Solution**: Check your Cloudinary configuration and preset settings

## 📋 Quick Checklist

- [ ] Upload preset `akamba_handicraft` exists
- [ ] Preset is set to **Unsigned**
- [ ] Preset has **Public** access mode
- [ ] Environment variables are set correctly
- [ ] Cloud name is correct: `dgyrfetyu`

## 🎯 Expected Behavior After Fix

1. **Click upload button** → Widget opens
2. **Select images** → Upload starts
3. **Progress shows** → Real-time feedback
4. **Upload completes** → Images appear in grid
5. **Widget stays open** → No redirect

The widget should now work properly without redirecting back to the products page! 🚀
