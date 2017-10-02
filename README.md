## Title: <br/>
#### Jabber Jam

## Description<br/>
Jabber Jam is a chatroom app that allows user to meet new people that are also interested in a certain category or certain topic. In order to use Jabber Jam, you will first need to create an account and then log in. Once you logged in, you will be able to see a list of chatrooms that are already created. You can filter this list by click on one of the categories at the right. If you can't find the chatroom you want in a certain category, you can create a chatroom in which you will need to enter the title and category of your chatroom. Once you created the chatroom, you will see your chatroom there and you will need to click on it to go in. From there, you can start talking about the topic, change the title and category, and delete the chatroom.

## Technology Used:<br/>
**FrontEnd**: HTML, CSS, Javasript, jQuery<br/>
**BackEnd**: NodeJs, Express, MongoDB, Mongoose, Mlab <br/>
**Deployment**: Heroku, Travis  <br/>

## Documentation of API <br/>
**GET** https://jabber-jam.herokuapp.com/chatrooms <br/>
**GET** https://jabber-jam.herokuapp.com/chatrooms/:id <br/>
**GET** https://jabber-jam.herokuapp.com/chatrooms/distinct <br/>
**POST** https://jabber-jam.herokuapp.com/chatrooms <br/>
**PUT** https://jabber-jam.herokuapp.com/chatrooms/:id <br/>    
**DELETE** https://jabber-jam.herokuapp.com/chatrooms/:id <br/>

## How to use our code <br/>
Fork it to your repo. <br/>
git clone repo_link <br/>
npm install <br/>
make sure mongodb is installed <br/>
run mongod <br/>
run npm start <br/>
go to localhost:8080 in browser<br/>

## Screenshots <br/>
#### SignUp Screen <br/>
When you signup, you go to log in screen<br/>
![SignUp](readme-assets/signUp.png "SignUp Screen")<br/>

#### Login Screen <br/>
When you login, you go to main screen<br/>
![LogIn](readme-assets/login.png "Login Screen")<br/>

#### MainScreen <br/>
This screen shows all chatrooms and all categories. You can also create chatroom from this screen.
![MainScreen](readme-assets/main.png "Main Screen")<br/>

#### Filter <br/>
When you click on one of the categories, it shows list of chatrooms in that category. When you click on one of the chatrooms, it will lead you to the chatroom page.<br/>
![Filter](readme-assets/filter.png "Filter Screen")<br/>

#### Chatroom <br/>
In this screen, you can update title and category, send messages, delete chatroom, or go back to main page.
![Chatroom](readme-assets/chatroom.png "Chatroom Screen")<br/>

#### Sending a Message <br/>
You can press your enter key or click send to send the message.
![SendMessage](readme-assets/send.png "Send Message Screen")
