/**
 * Main callbacks file for api
 *
 *
 */
//Dependencies
const Product = require('../Models/Product');
const helpers = require('../utils/helpers');
const User = require('../Models/User');

//container for all callbacks
const callbacks = {};

callbacks.createdResources = ['products', 'users'];

callbacks.api = function (req, res) {
   // The requested resource(i.e users) is provided as a parameter
   const requestedResource = req.params.resource;
   // Check if it is registered in the created resources
   if (callbacks.createdResources.indexOf(requestedResource) > -1) {
      callbacks[requestedResource](req, res);
   } else {
      res.status(404).json({
         Error: 'The resource you requested does not exist',
      });
   }
};
//callback products methods
callbacks.productsAllowedMethods = ['post', 'get'];
callbacks.products = function (req, res) {
   const requestedMethod = req.method.toLowerCase();

   if (callbacks.productsAllowedMethods.indexOf(requestedMethod) > -1) {
      callbacks._products[requestedMethod](req, res);
   } else {
      res.status(405).json({ Error: 'Method not allowed for this resource' });
   }
};

//callback products methods
callbacks._products = {};

//Handle postin of a product
callbacks._products.post = function (req, res) {
   let { name, price, cancelledPrice, category, label, description, features } =
      req.body;
   features = helpers.formatFeatures(features);
   const imagePaths = helpers.getImagesPaths(req.files);
   const newProduct = new Product({
      name,
      price,
      cancelledPrice,
      category,
      label,
      description,
      features: features,
      imagePaths,
   });

   newProduct
      .save()
      .then(() => {
         res.json({ msg: 'Products has been saved' });
      })
      .catch(err => {
         console.log(err);
         res.json({ msg: 'Product could not be saved' });
      });
};
callbacks._products.get = function (req, res) {
   Product.find(req.query)
      .then(function (data) {
         res.json({ msg: 'will get', data });
      })
      .catch(function (err) {
         console.log(err);
      });
};

/**
 * The user resource
 *
 *
 */

// Currently acceptable methods for the user resource
callbacks.usersAllowedMethods = ['post', 'get'];
callbacks.users = function (req, res) {
   const requestedMethod = req.method.toLowerCase();
   if (callbacks.usersAllowedMethods.indexOf(requestedMethod) > -1) {
      callbacks._users[requestedMethod](req, res);
   } else {
      res.status(405).json({ Error: 'Method not allowed for this resource' });
   }
};

//Container for users submethods
callbacks._users = {};

// Posting
callbacks._users.post = async function (req, res) {
   console.log('body', req.body);
   const { email, password } = req.body;
   let errors = false;
   let errorsObj = {
      email: [],
      password: [],
   };
   await (async function () {
      for (let key in req.body) {
         if (errors === false) {
            if (key == 'email') {
               if (email.length < 1) {
                  errorsObj['email'].push('Email is required');
                  errors = true;
               }
               if (await helpers.ifEmailExistInDatabase(email)) {
                  errorsObj['email'].push('Email already exist');
                  errors = true;
               }
            }
            if (key == 'password') {
               if (password.length < 8) {
                  errorsObj['password'].push(
                     'Password should a minimum length of 8'
                  );
                  errors = true;
               }
               if (password.length > 20) {
                  errorsObj['password'].push(
                     'Password should a maxmimu length of 20'
                  );
                  errors = true;
               }
            }
         } else {
            break;
         }
      }
   })();
   if (errors) {
      res.status(400).json({
         errors: errorsObj,
         value: {
            email,
            password,
         },
      });
   } else {
      res.send('Good request');
      // try{
      //     const hashedPassword = await helpers.hash(password);
      //     const newUser = new User({
      //         email,
      //         password: hashedPassword,
      //     });
      //     const savedUser = await newUser.save();
      //     res.json({
      //         'msg': 'User has been saved',
      //     });
      // }catch(e){
      //     console.log(e);
      //     res.status(500).json({
      //         'Error': 'Could not save user due to an internal server error',
      //     })
      // }
   }
};

// Get
callbacks._users.get = async function (req, res) {
   const queryParams = req.query;
   const query = {};
   for (let key in queryParams) {
      query[key.trim()] = queryParams[key].trim();
   }
   try {
      const user = await User.find(query);
   } catch (e) {
      console.log(e);
   }
};

//export the container
module.exports = callbacks;
