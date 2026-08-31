# Shivtej Industries - Modern Website

A modern, high-converting, lightweight static website built for **Shivtej Industries** (Quality Foam Solutions Manufacturer).

---

## 🚀 How to Deploy to Netlify (Takes 1 Minute!)

### Method 1: Drag & Drop (Easiest & Fastest)
1. Go to [app.netlify.com](https://app.netlify.com/) and log in (or create a free account).
2. Go to the **"Sites"** tab.
3. Simply drag and drop the `shivtej-industries` folder into the Netlify drop zone.
4. Your website is instantly live with a free SSL certificate!

### Method 2: Connect via GitHub / GitLab
1. Push this folder to a GitHub repository.
2. In Netlify, click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Leave build settings default (`publish directory: .`).
5. Click **"Deploy Site"**. Any time you update code on GitHub, Netlify automatically redeploys.

---

## 📬 Built-in Netlify Forms (Zero Backend Needed)

The contact and quote forms have **Netlify Forms** already built-in (`data-netlify="true"`):
- Whenever a visitor submits a quote or inquiry on your site, Netlify automatically captures the submission.
- You can view all submissions directly in your **Netlify Dashboard > Forms**.
- You can also set up email notifications in Netlify to get an instant email at `shivtejentp1575@gmail.com` whenever a new inquiry arrives.

---

## ✏️ How to Customize & Update Content

### 1. Changing Contact Details & Phone Numbers
Open `index.html` and search for:
- Phone: `+91 8805521152`
- Email: `shivtejentp1575@gmail.com`
- Location: `Chikhli, Maharashtra, India`
- WhatsApp Link: `https://wa.me/918805521152`

### 2. Adding or Editing Products
In `index.html`, locate the `<div class="products-grid">` section. Each product is a `<div class="product-card">`. You can copy/paste any card, change the image, title, specs, or category.

### 3. Adding New Images
Place your images in `assets/images/` and reference them in `index.html` like:
```html
<img src="assets/images/your-new-image.jpg" alt="Product Name">
```

### 4. Changing Theme Colors & Branding
Open `css/styles.css` and customize the `:root` variables at the top of the file:
```css
:root {
  --color-primary: #f97316;       /* Main Brand Color */
  --color-primary-hover: #ea580c; /* Hover Color */
  --color-dark-bg: #0a0f1d;       /* Dark Section Background */
  ...
}
```

---

## 📁 Directory Structure

```
shivtej-industries/
├── index.html          # Semantic HTML5 homepage, product catalog & forms
├── netlify.toml        # Netlify deployment, headers, and caching rules
├── README.md           # Instructions & customization guide
├── css/
│   └── styles.css      # CSS3 design system with CSS variables & responsive layout
├── js/
│   └── main.js         # Navigation, filter tabs, quote modal, and form submission
└── assets/
    ├── favicon.svg     # Modern brand favicon
    └── images/         # High-resolution product, industry, and logo images
```
