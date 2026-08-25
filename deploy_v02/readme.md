# Kiran Banda — Portfolio

Folder-style deploy. Drag this whole folder onto https://app.netlify.com/drop and you're live.

## Deploying to Netlify

1. Visit https://app.netlify.com/drop (sign up free)
2. Drag the entire `deploy` folder onto the page
3. Live URL appears (e.g. `yoursite.netlify.app`)

## Connecting your GoDaddy domain

1. Netlify → site → **Domain management** → **Add custom domain** → enter your domain
2. Netlify shows DNS records to add (an A record + a CNAME)
3. GoDaddy → **My Products** → your domain → **DNS** → **Manage DNS**
4. Delete the parking A record on `@`, add the records Netlify gave you
5. Wait 10 min – a few hours, then back in Netlify click **Verify DNS** → **Provision HTTPS**

## Adding your real images and videos

See `media/README.md` for full instructions. Short version:
1. Drop your files into `media/projects/<slug>/`
2. Edit `proto/data.jsx` to point to them (`hero: 'media/...'`)
3. Re-drop the folder onto Netlify Drop, OR connect a GitHub repo for auto-deploys

## Updating later

**Easy:** drag the folder onto Netlify Drop again — it overwrites the previous deploy.
**Better:** push the folder to a GitHub repo and connect Netlify → "Continuous deployment" → every git push auto-deploys.
