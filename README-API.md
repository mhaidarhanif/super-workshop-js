# Super Workshop JS :gear: API

## [Things to Know](http://blog.getpostman.com/2016/04/25/simplifying-api-documentation-for-a-great-first-user-experience)

1. Who is your user?
2. What does your API do?
3. How does one access your API?
4. How can someone quickly use your API?
5. How can someone integrate your API?
6. What is the extent of your API?
7. Where does someone ask for help?

## [How to Determine API Resources](https://zapier.com/learn/apis/chapter-6-api-design)

1. Decide what resource(s) need to be available.
2. Assign URLs to those resources.
3. Decide what actions the client should be allowed to perform on those resources.
4. Figure out what pieces of data are required for each action and what format they should be in.

## [How to Implement Password Reset](https://stormpath.com/blog/the-pain-of-password-reset)

1. Put forgot password link in sign up or sign in page.
2. In password reset page, there is a form to enter email address. Ask for a second factor to identify the user at this stage or a later stage.
3. After the user has entered their email address, send an email with a link to the password reset page. This link should contain a unique password reset token that expires after a certain amount of time and one first use. MUST unique and expire.
4. After sent the user an email, give them a message telling them what to do! Tell the user you sent them an email, and tell them to check their inbox.
5. After the user clicks the link in their email, they should be brought to a page the site that prompts them to enter a new password. Ensure you make the user enter their new password twice so they don’t forget what they just typed. Make sure you validate their token before proceeding! If the token isn’t valid, you should display an error message and instructions on how to proceed.
6. Once the user has reset their password, give them a confirmation message in the page and email. “Your password has been reset” is typically good enough.
7. Lastly, ensure you send the user an email once their password has been changed letting them know what happened. This will ensure the user knows what they did, and is a great auditing tool in the future. It’s also an easy alert in the event the user didn’t initiate the reset themselves.

## References

- [An Introduction to APIs, by Zapier](https://zapier.com/learn/apis)
- [HTTP API Development Tools](https://github.com/yosriady/api-development-tools)
- [`Kikobeats/awesome-api`](https://github.com/Kikobeats/awesome-api)
- [HTTP API Design Guide](https://geemus.gitbooks.io/http-api-design/content/en)
