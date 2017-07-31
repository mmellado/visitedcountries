# Visited Countries Tracker

This app helps you keep track of the countries you've visited.

It displays an SVG map in which you can select any visited countries by higlighting them.

If the country you're looking for is too hard to find, you can also zoom in to find it or search for it with the search box and select it from the list.

The app requires the user to login with Facebook (I was too lazy to build a login system and most people use Facebook anyways) to be able to keep track of individual users and their previosuly selected countries.

The information is sent asynchronously to a NodeJS backend hosted in Heroku and then stored in a MongoDB database. The only information stored is the user's Facebook uid and the selected countries.

The backend can be found at https://github.com/mmellado/visitedcountries-backend.

## Feature requests & Bug reports

If there's more features you'd like to have in this app, please file an issue or submit a pull request with your changes. Contributions are very welcome :)

## Upcoming features

- List for "Bucket listed" countries marked in the map with a different color
- User specific "Read Only" page to be shared width friends
- Typeahead selection with keyboard
- Use API Token to communicate with the backend
