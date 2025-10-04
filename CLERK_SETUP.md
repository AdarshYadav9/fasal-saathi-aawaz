# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication with Google OAuth for the Smart Crop Advisory System.

## 🔧 Prerequisites

1. A Clerk account (sign up at [clerk.com](https://clerk.com))
2. A Google Cloud Console project with OAuth credentials
3. Node.js and npm installed

## 📋 Step-by-Step Setup

### 1. Create a Clerk Application

1. Go to [clerk.com](https://clerk.com) and sign up/login
2. Click "Create Application"
3. Choose "React" as your framework
4. Select "Next.js" as your template (we'll adapt it for Vite)
5. Name your application "Smart Crop Advisory"

### 2. Configure Google OAuth

1. In your Clerk dashboard, go to "Authentication" → "Social Connections"
2. Click "Add connection" and select "Google"
3. You'll need to set up Google OAuth credentials:

#### Google Cloud Console Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
   - `http://localhost:3000` (for development)
7. Copy the Client ID and Client Secret

#### Back in Clerk:
1. Paste your Google Client ID and Client Secret
2. Set the redirect URL to your domain
3. Enable the connection

### 3. Configure Environment Variables

Create a `.env` file in your project root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

You can find your publishable key in the Clerk dashboard under "API Keys".

### 4. Update Clerk Configuration

In your Clerk dashboard, go to "Authentication" → "Email, Phone, Username" and configure:

- **Email address**: Enable
- **Phone number**: Enable (optional)
- **Username**: Enable (optional)

### 5. Configure Sign-in/Sign-up Pages

1. Go to "Customize" → "Sign-in & Sign-up"
2. Choose your preferred layout
3. Enable/disable social providers as needed
4. Customize the appearance to match your app

### 6. Set up Redirect URLs

In "Authentication" → "Redirect URLs", add:
- `http://localhost:5173` (for development)
- `https://your-production-domain.com` (for production)

## 🚀 Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`

3. Click "Sign In" to test the authentication flow

4. Try signing in with Google to verify OAuth is working

## 🔧 Advanced Configuration

### Custom Styling

You can customize Clerk components by passing appearance props:

```tsx
<SignInButton 
  appearance={{
    elements: {
      rootBox: "w-full",
      card: "shadow-lg",
      headerTitle: "text-2xl font-bold",
      socialButtonsBlockButton: "w-full bg-blue-500 hover:bg-blue-600"
    }
  }}
/>
```

### User Profile Management

Clerk provides built-in user profile management:

```tsx
import { UserProfile } from '@clerk/clerk-react'

<UserProfile 
  appearance={{
    elements: {
      rootBox: "w-full max-w-2xl",
      card: "shadow-lg"
    }
  }}
/>
```

### Webhooks (Optional)

For advanced features, you can set up webhooks:

1. Go to "Webhooks" in your Clerk dashboard
2. Add endpoint: `https://your-api.com/api/webhooks/clerk`
3. Select events you want to listen to
4. Implement webhook handler in your backend

## 🛡️ Security Best Practices

1. **Environment Variables**: Never commit your `.env` file
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Session Management**: Configure session timeouts appropriately

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid publishable key"**
   - Check that your `.env` file is in the project root
   - Verify the key starts with `pk_test_` or `pk_live_`
   - Restart your development server

2. **Google OAuth not working**
   - Verify redirect URIs in Google Cloud Console
   - Check that Google+ API is enabled
   - Ensure Client ID and Secret are correct in Clerk

3. **CORS errors**
   - Add your domain to allowed origins in Clerk
   - Check that you're using the correct protocol (http/https)

4. **Styling issues**
   - Use Clerk's appearance prop for custom styling
   - Check that Tailwind classes are not conflicting

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [React SDK Reference](https://clerk.com/docs/references/react)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Clerk Community](https://clerk.com/community)

## 🎯 Next Steps

Once authentication is working:

1. Implement user profile management
2. Add role-based access control
3. Set up user data synchronization
4. Configure email templates
5. Add multi-factor authentication (optional)

Your Smart Crop Advisory System now has a robust authentication system with Google OAuth integration!
