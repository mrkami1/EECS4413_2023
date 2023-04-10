# EECS4413_M 2022 W

## Intro
This is York University EECS4413 course project of Team L:

Mashhood Anwar

Ying Zhang

Yang Lan

Anubhav Nag

This small ecommerce project uses Google Firebase for backend data storage & structuring, with React frontend logic & business.

## Local testing
1. Pull the project to local working folder, and start from project root.
2. Install dependencies using bash or powershell run `npm install`
3. Run `npm run start` or `npm start`
4. Local starting url is `https://localhost:3000/`

## Some usable info
1. For admin account access, use `ajenson@gmail.com` with `1234!Qwer`
2. Register for any regular customer account, using 8+ numeric-aphabetic pswd
3. Explicitly provide arbitrary shipping address & 16-digit credit card number to purchase
4. Some product ID to play with:
arale_black alivia_blue cascata_pink
colin_green gabriel_brown juliet_green

## Flyer edit steps:
1. Login as admin account, such as `ajenson@gmail.com` above
2. Go to Flyer page
3. The page will show today's date, and a list of current on-sale products with their respective discount %
4. You can delete some of the items, or add new item with product ID (some are listed above). Newly added product will get default 1% discount value.
5. You can edit each item's discount level, and press `update` button to apply the change (not done yet)
6. You can also change the expiration date on top, select a date in future and press `update expiration` and you will see all item's expiration dates are updated.
7. Once you see all `update` buttons are grey-out, and expiration is set, you can press the `Save Update` button below to apply all changes to the database.

Enjoy and let us know if you need any help or have suggestions!
