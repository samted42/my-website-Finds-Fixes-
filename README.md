# Sam Teddy: Affiliate Website

A multi-niche affiliate website covering Tech, Home, Fashion and Fitness.
Built with plain HTML, CSS and JavaScript (no frameworks), hosted on Vercel,
with a login-protected admin page for managing affiliate stores and products.

> Headline: "We find the best products. You get the perfect products."

---

## 1. What is in this project

| File | Purpose |
|---|---|
| `index.html` | The public homepage |
| `style.css` | All styling (colors and sizes are at the top of the file) |
| `site.js` | Fills the "Current winners" list from the database |
| `admin.html` | Login-protected page for adding stores and products |
| `supabase-config.js` | Your Supabase project URL and anon public key |
| `supabase-setup.sql` | One-time script that creates the database tables and security rules |
| `products.js` | Fallback data, used only if Supabase isn't set up |
| `README.md` | This guide |
| `CLAUDE.md` | Project notes and rules for Claude |

Hidden folder: `.vercel/` links this folder to your Vercel project. Don't delete it.

## 2. How it works

```
Visitor  -->  index.html  -->  site.js  -->  Supabase (reads products)
You      -->  admin.html  -->  log in  -->  Supabase (adds stores/products)
```

- Anyone can **read** products. Only logged-in users can **add or remove** them.
  This is enforced by database rules in `supabase-setup.sql`, not by the page.
- There is **no sign-up** feature. Accounts are created only by you in the Supabase dashboard.
- Until Supabase is set up, the homepage shows its placeholder rows and
  `admin.html` shows "Setup needed". Nothing breaks.

## 3. Set up Supabase (one time)

1. Create a free project at <https://supabase.com>.
2. Open **SQL Editor > New query**, paste the contents of `supabase-setup.sql`, and click **Run**.
3. Turn off public sign-ups: in **Authentication**, switch off the setting that allows new users to sign up.
4. Create your login: **Authentication > Users > Add user**. Enter your email and a strong password
   (tick auto-confirm if offered). Add team members the same way.
5. Open **Project Settings > API** and copy the **Project URL** and the **anon public** key.
6. Paste both into `supabase-config.js`.
7. Redeploy (see section 5).

**Security rules**
- The anon public key is designed to be public. It is safe because of the database rules above.
- **Never** put the `service_role` key anywhere in this project, in GitHub, or on the site.
- Never commit passwords.

## 4. Preview locally

Open `index.html` by double-clicking it, or serve the folder:

```
python -m http.server 8000
```

Then visit <http://localhost:8000>. The admin page is at <http://localhost:8000/admin.html>.

## 5. Deploy to Vercel

Install the CLI once: `npm install -g vercel`, then log in with `vercel login`.

From inside the project folder (the one containing `index.html` and `.vercel`):

```
vercel deploy --prod
```

It prints a **Production** address. Open it, then add `/admin.html` to the end for the admin page.

Notes:
- Run the command from the folder that directly contains `index.html`. Don't run it from a parent or sub-folder.
- A preview address (from `vercel deploy` without `--prod`) is a snapshot and may be protected by a Vercel login.
  Share the Production address.
- Vercel has no place to paste a README. `README.md` is just another file in the folder.
  It will be publicly readable at `/README.md`, so keep secrets out of it.

## 6. Put the project on GitHub

You need Git installed and a GitHub account.

1. On github.com, click **New repository**. Name it `my-website`. Choose **Private** if you prefer.
   Do **not** tick "Add a README" (you already have one).
2. In PowerShell, from the project folder:

```
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/my-website.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. GitHub may ask you to sign in the first time.
The `.vercel` folder is ignored by `.gitignore`, so it won't be uploaded.

3. Your README now shows on the repository's front page.

### Optional: automatic deployments

In your Vercel project, open **Settings > Git > Connect Git Repository** and choose the repo.
After that, every push to `main` deploys automatically, and you no longer need `vercel deploy --prod`.

Later changes:

```
git add .
git commit -m "Describe your change"
git push
```

## 7. Day-to-day: adding stores and products

1. Go to `your-production-address/admin.html` and log in.
2. Add a **store** (name, and the affiliate network if you like).
3. Add a **product**: name, store, category, optional badge and verdict, optional image, and your affiliate link.
4. It appears under **Current winners** on the homepage straight away.

Rules:
- Affiliate links must start with `https://`.
- Images can be an `https://` address or a file path such as `images/photo.jpg`.
- To change a product, remove it and add it again (editing is on the to-do list).

## 8. Replace the placeholders

Search `index.html` for `[` to find text still to write:

- [ ] Page description (`<meta name="description">`) and the `<title>`
- [ ] Trending reviews (titles and verdicts)
- [ ] Category sub-links under Tech, Home, Fashion, Fitness
- [ ] "How I choose" paragraph
- [ ] Affiliate disclosure: check the wording against your country's rules and each affiliate program's terms
- [ ] Real product photos in place of the striped blocks

## 9. Tracking and compliance

- Every "Check price" button carries `data-slug`, `data-niche`, `data-store` and `data-pos`.
  These are ready for GA4 click tracking and for building SubIDs.
- Every affiliate link uses `rel="sponsored noopener"`.
- Keep a clear affiliate disclosure on the site, above your first affiliate link.
- Check each program's rules before using link cloaking, showing prices, or using cookies and tracking.

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| Page shows with no styling | `style.css` must sit next to `index.html` with that exact name. Hard refresh (Ctrl+Shift+R) |
| `/admin.html` says "not found" | The file wasn't in the deployed folder. Check `dir`, move files out of any sub-folder, redeploy |
| Admin says "Setup needed" | Paste your keys into `supabase-config.js`, then redeploy |
| Admin says "Could not load data" | Run `supabase-setup.sql` in the Supabase SQL Editor |
| Login fails | Check the user exists under Authentication > Users and is confirmed. Check email and password |
| Added product doesn't appear | The link must start with `https://`. Hard refresh the homepage |
| Browser says "site can't be reached" | You used a placeholder address. Use the real Production address from Vercel |
| Preview address asks for a Vercel login | Deployment protection on previews. Use the Production address |
| `fatal: not a git repository` | Run `git init` in the project folder (section 6) |
| Vercel asks to create a new project | You're in the wrong folder, or `.vercel` was deleted. Run from the folder containing `.vercel` |

## 11. Roadmap

- Edit existing products in the admin page
- Password reset
- Trending reviews and category tiles driven by the database
- Product and review pages with comparison tables and a sticky call-to-action
- GA4 `affiliate_click` event tracking
- Custom domain

## 12. Credits

Owner: Sam Teddy. Built with plain HTML, CSS and JavaScript, Supabase and Vercel.
