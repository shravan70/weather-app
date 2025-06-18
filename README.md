# weather-app

## Requirements

1. node
2. mongo DB
3. React Router
4. MUI

## To install in Mac - Platform.

```bash

#install node

- Go to the official Node.js website and Install node:
     https://nodejs.org

#install MongoDB

#use command prompt:
brew tap mongodb/brew
brew install mongodb-database-tools

# Run mongo db

mongosh

#open new terminal

mongorestore --db weather ./dump/weather

# clone the repository
git clone https://github.com/shravan70/weather-app

cd weather-app

# Install client dependencies
npm install

# Install server dependencies
cd ../server
npm install

# To run server
npm start

# To run client
cd ../client
npm start




## To install in Windows - Platform

# download mongo db community
https://www.mongodb.com/try/download/community

# download mongo db shell
https://www.mongodb.com/try/download/shell

# download mongo db database-tools
https://www.mongodb.com/try/download/database-tools


# set environment path of the above

# clone git repository
git clone https://github.com/your-username/weather-app.git
cd weather-app

# install client dependencies
cd client
npm install
npm start

#install server dependencies
cd ../server
npm install

#restore Database
mongorestore --db weather ./dump/weather

#start server.
npm start
```
