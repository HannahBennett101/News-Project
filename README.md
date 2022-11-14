# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Instructions on how to clone the GitHub Repository and run it locally

1. Ensure you have cloned the git repo first (i.e. create a fork, and clone iiinto your terminal)
2. Createe a new public Git Repository whilst ensuring not to initialise the project with readme, gitignore or license
3. From your cloned repository (in the terminal) you'll want to push your code into your newly creted repository using the folloooowing commands in your terminal:
git remote set-url origin YOUR_NEW_REPO_NAME_HERE
git branch -M main
git push -u origin main
4. Once this has been run, refresh your GitHub (GUI) to ensure that the news repository is now in your newly created repository
5. You need to create two .env files in the project, .env.test and .env.development .... Into each, add PGDATABASE=<database_name_here> with the correct database name (nc_news and nc_news_test respectively)