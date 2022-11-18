## News API

## Initial Set-Up Guidance

1. (Ensure Git is installed) Type the following into your cmd line to clone the Git repository "git clone https://github.com/HannahBennet101/news-project.git
2. In the cmd line, navigate to the repository (now it is cloned) and install all dependencies from the package.jsoon using the command "npm i"
3. In order to seed the database, type "npm setup-dbs" into your command line. (Please make sure you have PSQL set-up, with a .pgpass file)
4. To run test, type 'npm t' into the command line


## Environment Variables

1. Two .env files must be created, these will store node environment variables and .env.development
2. In each .env file, PGDATABASE muist be set to the name of the database that will be connectetd to. In the .env.test file, set PGDATABASE=nc_news_test and in the .env.development set PGDATABASE=nc_news