GIT & DEPLOY STEPS (run locally):

git init
git add .
git commit -m "Initial commit: FakeNewsZeiTon MVP"

# Create GitHub repo (requires gh CLI logged in)
gh repo create FakeNewsZeiTon --public --source=. --remote=origin --push

# Deploy to Vercel (requires vercel CLI logged in)
vercel --prod
