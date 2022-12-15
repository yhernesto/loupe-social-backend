# Loupe Social
See [Project Reference](https://sites.google.com/view/trending-analyzer/home). Page with commercial information about this project

# The Basics

## App Description

LoupeSocial is a web app that get social media information about a brand, its account information, what people are talking about its official hashtag brand and analyze sentiment in posts content that mentions hashtag brand

## Tech Stack

## Frontend

- Vue.js 3
    
    
- Quasar
    
    In future will be changed by Vuetify. This depends on Vuetify improvements about Axios
    

## Backend

- Node.JS
    
    14.1 version
    
- NestJS
    
    Is a framework for building scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript, combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming)
    
    - TypeScript
    - Express

## Database

- MongoDB
    
    MongoDB Atlas allow us use a cloud based database natively
    

## Infrastructure

- Docker
- Kubernetes
- Google Cloud Engine/ DigitalOcean

## ML

- Google Sentiment Text
- Google Vision API
- Custome ML

## APIs

- Instagram API
    
    For the time being we are working with a Kirtan API solution
    

## Data Warehouse

- Google Cloud Storage
- Google Big Query

# Requirements

## Node manager

Currently the project is using Node 16.4v. You **must** install node using a node version manager as [nvm for mac/linux](https://desarrolloweb.com/home/nvm) or [nvm for windows](https://github.com/coreybutler/nvm-windows) 

## IDE

VSCode is our official IDE. Necessary extensions are:

- Code Spell Checker
- Docker
- DotENV
- ESLint
- Live  Share
- Prettier
- Vetur
- Visual Studio IntelliCode

## Database

This project use MongoDB Atlas, in order to visualize data in database project we recommend use [MongoDB Compass](https://www.mongodb.com/try/download/compass) and login with MONGO_DB_TEST .env variable

# Get the project

your github user should be added to Appeiron-tech organization, if not please contact with your team leader.

- In your PC create a folder for LoupeSocial
- Download backend or frontend project from github
- Create an environment file file for each project
    - Backend test environment file: **.env**
    
    ```bash
    #########################
    #DATABASE
    MONGO_DB_TEST=''
    
    #########################
    #GOOGLE CLOUD STORAGE
    GCS_BUCKET_NAME='trends_analyzer_static_files'
    GCS_PROFILE_PICS_DIRECTORY='profile_pics'
    GCS_PROFILE_POST_PICS_DIRECTORY='profile_posts_pics'
    GCS_HASHTAG_POST_PICS_DIRECTORY='hashtag_posts_pics'
    
    GCS_PROJECT_ID='sentimen-analyzer'
    GCS_STORAGE_MEDIA_BUCKET='users_clients'
    GCS_CLIENT_EMAIL=''
    
    #########################
    #JWT
    JWT_SECRET='mysecretejwtpassword'
    
    #########################
    #BCRYPT
    SALT_ROUNDS=10
    
    #########################
    #Rapidapi
    #----- Instagram  ------#
    # PSADBRO 
    PSADBRO_API_ENDPOINT='https://instagram47.p.rapidapi.com'
    PSADBRO_API_KEY=''
    PSADBRO_API_HOST='instagram47.p.rapidapi.com'
    
    # KIRTAN
    KIRTAN_API_ENDPOINT='https://instagram-bulk-profile-scrapper.p.rapidapi.com'
    KIRTAN_API_KEY=''
    KIRTAN_API_HOST='instagram-bulk-profile-scrapper.p.rapidapi.com'
    ```
    
    - Backend add a key.json file to authenticate account service:
    
    ```json
    {
      "type": "service_account",
      "project_id": "sentimen-analyzer",
      "private_key_id": "",
      "private_key": "",
      "client_email": "trending-analyzer@sentimen-analyzer.iam.gserviceaccount.com",
      "client_id": "",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/trending-analyzer%40sentimen-analyzer.iam.gserviceaccount.com"
    }
    ```
    
    - Frontend test environment file: **.env.development**
