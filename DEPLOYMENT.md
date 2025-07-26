# 🚀 Deployment Guide - Coventry University Astana Platform

This guide will walk you through deploying the gamified academic platform to production.

## 📋 Prerequisites

- **Supabase Account**: [Sign up at supabase.com](https://supabase.com)
- **Vercel Account**: [Sign up at vercel.com](https://vercel.com) (recommended)
- **Git Repository**: Your code pushed to GitHub, GitLab, or Bitbucket
- **Node.js 18+**: For local development and testing

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `coventry-astana-platform`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Set Up Database Schema
1. Wait for project initialization (2-3 minutes)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the entire contents of `database-schema.sql`
4. Click **Run** to execute the schema
5. Verify tables are created in **Table Editor**

### 1.3 Configure Authentication
1. Go to **Authentication** > **Settings**
2. Configure **Site URL**: `https://your-domain.com` (or localhost for testing)
3. Add **Redirect URLs**:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:5173/auth/callback` (for development)
4. Enable **Email Auth** (default is fine)
5. Optionally configure social providers (Google, GitHub, etc.)

### 1.4 Get API Keys
1. Go to **Settings** > **API**
2. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## 🌐 Step 2: Vercel Deployment

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your Git repository
4. Choose the repository containing your platform code

### 2.2 Configure Build Settings
Vercel should auto-detect the settings, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables
In the Vercel deployment configuration:
1. Click **"Environment Variables"**
2. Add the following variables:
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
   ```
3. Set environment to **Production, Preview, and Development**

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔒 Step 3: Security Configuration

### 3.1 Update Supabase URLs
1. Go back to Supabase **Authentication** > **Settings**
2. Update **Site URL** to your Vercel domain
3. Add your Vercel domain to **Redirect URLs**

### 3.2 Configure CORS (if needed)
If you encounter CORS issues:
1. Go to Supabase **Settings** > **API**
2. Add your domain to **CORS origins**

### 3.3 Row Level Security
The database schema includes RLS policies, but verify:
1. Go to **Authentication** > **Policies**
2. Ensure all tables have appropriate policies enabled
3. Test with different user roles

## 👥 Step 4: Create Test Users

### 4.1 Create Professor Account
1. Go to your deployed app
2. Register with: `professor@test.com`
3. In Supabase **Authentication** > **Users**:
   - Find the user
   - Update their raw user metadata to include: `{"role": "professor"}`
4. In **Table Editor** > **users**:
   - Update the user's role to `professor`

### 4.2 Create Student Account
1. Register with: `student@test.com`
2. The role should default to `student`
3. Verify in the users table

## 🧪 Step 5: Testing

### 5.1 Functionality Tests
Test these key features:
- [ ] User registration and login
- [ ] Role-based access (student vs professor)
- [ ] Quest creation (professor)
- [ ] Quest completion (student)
- [ ] XP and badge system
- [ ] Quiz functionality
- [ ] Q&A system
- [ ] Daily rewards
- [ ] Notifications

### 5.2 Performance Tests
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness
- [ ] Database query performance
- [ ] Image loading optimization

## 🔧 Step 6: Custom Domain (Optional)

### 6.1 Vercel Custom Domain
1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

### 6.2 Update Supabase Settings
1. Update **Site URL** in Supabase to your custom domain
2. Update **Redirect URLs** accordingly

## 📊 Step 7: Monitoring & Analytics

### 7.1 Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor page views, performance, and errors

### 7.2 Supabase Monitoring
1. Monitor database usage in Supabase dashboard
2. Set up alerts for high usage
3. Review authentication logs

## 🔄 Step 8: Continuous Deployment

### 8.1 Automatic Deployments
Vercel automatically deploys when you push to your main branch:
1. Make changes locally
2. Commit and push to Git
3. Vercel automatically builds and deploys
4. Test the changes on your live site

### 8.2 Preview Deployments
- Every pull request gets a preview URL
- Test changes before merging to main
- Share preview links with stakeholders

## 🛠️ Troubleshooting

### Common Issues

#### Build Errors
```bash
# If you get TypeScript errors
npm run build
# Fix any type errors before deploying
```

#### Environment Variables
- Ensure all `VITE_` prefixed variables are set
- Check for typos in variable names
- Verify Supabase keys are correct

#### Authentication Issues
- Check Supabase Site URL matches your domain
- Verify redirect URLs are correct
- Ensure RLS policies are properly configured

#### Database Connection
- Verify Supabase project is active
- Check API keys are valid
- Ensure database schema was applied correctly

### Getting Help

1. **Vercel Issues**: Check [Vercel Documentation](https://vercel.com/docs)
2. **Supabase Issues**: Check [Supabase Documentation](https://supabase.com/docs)
3. **Platform Issues**: Review application logs in Vercel dashboard

## 📈 Post-Deployment Tasks

### 1. User Training
- Create user guides for professors and students
- Record demo videos
- Schedule training sessions

### 2. Data Migration
- Import existing student data (if applicable)
- Set up initial quests and badges
- Configure user roles

### 3. Monitoring Setup
- Set up error tracking
- Monitor performance metrics
- Create backup procedures

### 4. Maintenance Schedule
- Regular database backups
- Update dependencies monthly
- Monitor security updates

## 🎯 Success Checklist

- [ ] Supabase project created and configured
- [ ] Database schema applied successfully
- [ ] Authentication working for both roles
- [ ] Application deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] Test users created and verified
- [ ] All core features tested
- [ ] Performance optimized
- [ ] Monitoring configured
- [ ] Documentation updated

## 🚀 Go Live!

Once all steps are completed:
1. Announce the platform to students and professors
2. Provide login instructions
3. Monitor initial usage and feedback
4. Be ready to provide support

---

**Congratulations! Your Coventry University Astana Gamified Academic Platform is now live! 🎉**

For ongoing support and updates, refer to the main README.md file.