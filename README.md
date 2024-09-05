# File Upload
A file storage site for users to upload and organize their files.

## Table of Contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Deployment](#deployment)
- [Author](#author)

## Overview

### The challenge

To create a stripped down version of Google Drive. Using standard encryption practices, users should be able to log on, create folders and upload files to the folders in order to be downloaded at a later time.

### Screenshots

When the user first visits the site, they are prompted to log in or can follow a link to sign up.
![image](https://github.com/user-attachments/assets/b2b73a38-4196-4231-801c-42de758ef23e)

Onced logged in, the user is presented with their folder and a form to create new folders. Folders can be renamed and deleted.
![image](https://github.com/user-attachments/assets/a6673ab4-e570-42c2-ac35-2562f6934e1f)

When a folder is opened, the files within the folder can be viewed and downloaded. A form is presented to upload new files to the folder.
![image](https://github.com/user-attachments/assets/848cf46d-96da-4151-bded-17d723fe9411)


## Links

- [Live Site](https://special-subsequent-calendula.glitch.me/)


## My process

### Built with

- NodeJS
- Express
- EJS
- PostgreSQL
- Prisma
- Supabase
- PassportJS
- multer

### What I learned

I learned how to interface with a PostgreSQL databse using the Prisma ORM. I used the Neon PostgreSQL service, I implemented CRUD actions to keep track of user folders and files as well as use it as a session store to keep track of user sessions. I also used Supabase to actually store the file and learned to handle files in Nodejs using multer and how to initiate downloads.

I needed to manage queiries to the database to keep them to a mimimum. This was done by keeping neccessary information as either parameters in the URL or attaching responses from the databse to the request object so that it does not need to be queried again.

### Continued development

My biggest priority would be to add sharing capablities to the files. Right now, files are only accessible to the user who uploaded them. The user would be able to select any file and create a share link that would make the file publically accessible to anyone else. The user would be able to dictace how long the share link is active. 

### Useful resources

- [Passport Local Strategy Guide]([https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Designing_the_LocalLibrary_models](https://www.passportjs.org/tutorials/password/)) - Instrumental to setting up user authentication
- [Prisma Session Store]([https://express-validator.github.io/docs/](https://github.com/kleydon/prisma-session-store#readme)) - Use the Prisma ORM to store and manage user sessions when logged in
- [Supabase Docs]([https://www.npmjs.com/package/express-async-handler](https://supabase.com/docs/guides/storage)) - Documentation on how to interface with Supabase storage to store the user's uploaded files

## Deployment

How to install this project locally:

1. Clone the repository
```
SSH - $ git clone git@github.com:singhalex/file_upload.git
```
2.  Move into the cloned directory
```
$ cd file_upload
```
3. Install the dependencies
```
$ npm i
```
4. Create a .env file
```
$ touch .env
```
5. You will need to the add the following variable to the .env file:
- DATABASE_URL - Connect to your DB
- SESSION_SECRET - A string to encrypt your user passwords
- SUPABASE_URL - Points to your Supabase storage
- SUPABASE_KEY - Key to grant access to your Supabase storage

## Author

- Website - [Github](https://github.com/singhalex)
- LinkedIn - [Alex Singh]https://www.linkedin.com/in/alex-singh-748000254/)
