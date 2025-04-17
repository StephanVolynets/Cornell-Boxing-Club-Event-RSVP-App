# Deployment Guide for Cornell Boxing Club Event App

This guide will walk you through deploying the Cornell Boxing Club Event Registration App to [Render](https://render.com/), a cloud platform that offers both static site hosting and Node.js services.

## Prerequisites

1. Create a [Render account](https://dashboard.render.com/register)
2. Create a [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) for the database
3. Have your GitHub repository ready with the latest code

## Step 1: Set Up MongoDB Atlas

1. Log in to MongoDB Atlas
2. Create a new project (or use an existing one)
3. Create a new cluster (the free tier is sufficient)
4. Create a database user with read/write permissions
5. Whitelist all IP addresses with `0.0.0.0/0` (for simplicity, though you can restrict it later)
6. Once your cluster is created, click "Connect" and select "Connect your application"
7. Copy the connection string (It will look like: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`)
8. Replace `<username>`, `<password>`, and `<dbname>` with your actual credentials and database name

## Step 2: Deploy to Render using the Blueprint

The easiest way to deploy this application is using Render's Blueprint feature:

1. Log in to your Render account
2. In the dashboard, click on "New" and select "Blueprint"
3. Connect your GitHub account if you haven't already
4. Select the repository containing your application code
5. Render will detect the `render.yaml` file and show the services it will create
6. Click "Apply" to start the deployment process

## Step 3: Configure Environment Variables

After the initial deployment, you'll need to configure the MongoDB connection:

1. Go to your Render dashboard
2. Select the "cornell-boxing-api" web service
3. Navigate to the "Environment" tab
4. Find the `MONGODB_URI` environment variable
5. Click "Edit" and paste your MongoDB Atlas connection string
6. Click "Save Changes"
7. Trigger a manual deploy for the changes to take effect

## Step 4: Final Verification

1. Once both services are deployed, click on the URL for the "cornell-boxing-frontend" service
2. Verify that the application loads and you can see the list of events
3. Test the event registration functionality
4. Test the admin panel by visiting `/admin` and logging in with your credentials
5. Verify that you can add, edit, and delete events as an admin

## Troubleshooting

If you encounter any issues during deployment:

### API Connection Issues

- Check that the `MONGODB_URI` environment variable is set correctly
- Ensure that your MongoDB Atlas IP whitelist allows connections from Render
- Check the API service logs in Render for more details

### Frontend Issues

- If the frontend can't connect to the backend, ensure the API service is running
- Check for CORS issues in the API service logs
- Verify that the API URL in the frontend code is using relative paths

### Database Issues

- Verify your MongoDB Atlas connection string is correct
- Check that the database user has the correct permissions
- Ensure that the database and collections exist

## Maintenance

To update your application after making changes:

1. Push the changes to your GitHub repository
2. Render will automatically detect the changes and rebuild your services
3. Monitor the build logs in Render to ensure everything deploys correctly

## Scaling (Future Considerations)

As your application grows:

1. Upgrade your MongoDB Atlas cluster for more storage and performance
2. Adjust the scaling settings in Render to handle increased traffic
3. Consider adding a CDN for static assets
4. Implement automated backups for your database

---

For more information or assistance, refer to:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
