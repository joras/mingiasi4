todo:
- ~~rest api for chat interface~~
- ~~database setup~~
  - ~~create data~~
  - ~~fuzzy search ~~
- langchain
   - ~~agent~~
   - ~~session~~
   - ~~need memory~~
- features
  - ~~product search~~
  - ~~add to basket~~
  - ~~create order from basket~~
  - ~~list orders with total~~
  
testtask:

Build a LangChain project
1. using GPT-4.5preview model
2. Function (tool) to search products from db based on size, colour and name
3. Function (tool) to add products to the basket per user
4. Function to submit basket and turn it into order
5. Function to retrieve all data about user history
6. Function to display Order confirmation
7. Take input only user name for user identification

Project is tested by chat like interaction with following prompts
1. Do you have a yellow, small “teddy bear”?
a. answer should contain several products
2. I'm interested in the “funny yellow teddy bear”
a. the model should ask “Would you like me to add it to the basket?”.
b. When the user answers “yes” - add product to basket.
c. This step can be repeated unlimited times
d. User can ask also directly to add something to the basket
3. “I would like to finish my order. How much is my total?”
a. Should call a function to create an order
b. Should call a function to display order confirmation (text not gui)
c. Basket should be emptied
4. “I wonder how much I have ordered from you from the beginning?”
a. Should return amount and short list of orders with timestamps