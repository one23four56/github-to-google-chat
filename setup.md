# Setup 


### Making a Webhook in Google Chat

First, you need to get a webhook URL from google chat, which can be done with the following steps:

1. Go into a room in Google Chat, click the name, and click manage webhooks  
![image](https://user-images.githubusercontent.com/72141247/116242575-a8103980-a72b-11eb-926d-c781c8901b41.png)
2. Once you do that, you should be taken to the make a webhook screen right away, but if not click 'Add Another'  
![image](https://user-images.githubusercontent.com/72141247/116243118-35538e00-a72c-11eb-88b7-9a2019d21046.png)  
![image](https://user-images.githubusercontent.com/72141247/116242874-f9b8c400-a72b-11eb-9b82-6435d2e16f8f.png)
3. Enter a name (presumably GitHub) and optional avatar url then click 'Save'  
4. When you are back at the manage webhooks screen, click the copy icon next to your webhook  
![image](https://user-images.githubusercontent.com/72141247/116243702-d5a9b280-a72c-11eb-93ea-4ebbe8f1480f.png)

### Linking that Webhook with GitHub (via this)

1. Open the page for the repo you want to link to google chat, and open the settings tab.
3. Click on 'Webhooks' on the sidebar to the left
4. Click 'Add Webhook' (to the right)   
![image](https://user-images.githubusercontent.com/72141247/116796175-2eb47600-aaa0-11eb-9d36-61698e3236ae.png)
5. Under payload url, type `https://github-to-google-chat.vercel.app/?url=`
6. Paste in the Webhook url from google chat, so the payload URL looks like this:  
`https://github-to-google-chat.vercel.app/?url={Google Chat Webhook URL}`
7. Set the content type to `application/json`   
![image](https://user-images.githubusercontent.com/72141247/116796203-68857c80-aaa0-11eb-8b26-470783c99324.png)
8. Choose the events you would like to be notified about, and then click 'Add Webhook'   
**IMPORTANT NOTE:** Currently, only some events have a custom message. These events are: 
- Pull Requests
- Pushes     
- Issues   

Everything else will use the default message, seen below.

If all goes well, you should see a message like this in google chat:   
![image](https://user-images.githubusercontent.com/72141247/116796245-97035780-aaa0-11eb-964d-92e6c96245ca.png)
