
To start this app:

0. Possibly unnecesary, but install any dependencies for both frontend and backend using $ npm install
1. From the /backend directory, run $ mongod
2. From the /backend directory, run $ mongo
3. From the /backend directory, run $ npm run dev
4. From the /frontend directory, run $ npm run start
5. Wait until server has compiled successfully
6. Open up a webpage on localhost:4200/

You can add and delete new foods to your list, and their macro breakdowns will automatically retreive and display on your list. The next version of the app will allow you to search for ingredients based on what best completes your macronutrient goals. For example, if you see that you need 20 more grams of protein for the day, but you are only 5 grams away from your carb limit, you can search for all foods in the database that have at least 20g protein, and fewer than 5 grams of carbs. I would also add query parameters to allow for specific dietary restrictions when searching (vegetarian, keto, kosher, celiac, etc), and selecting total macros for a specific meal (breakfast, lunch, or dinner).

Please feel free to contact me with any questions or ideas about the app. jarrettrportnoy@gmail.com