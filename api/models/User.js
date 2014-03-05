/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 *
 * https://github.com/balderdashy/waterline#options
 */

module.exports = {

	//prevent unwanted/private info been saved to DB.
	//create a key called schema with value true
	//only saves attributes that exist here in this file
	schema: true,

	//http://stackoverflow.com/questions/17564820/sails-mysql-schema-datatypes
	//
	// Disables Automatic ID generation
  	// (allows you to use a FLOAT type for your ID)
  	autoPK: false,

	attributes: 
	{

		name: 
		{
			type:'string',
			required:true
		},

		title:
		{
			type: 'string'
		},

		email:
		{
			type: 'string',
			email: true,
			required: true,
			unique: true
		},

		admin:
		{
			type: 'boolean',
			defaultsTo: false
		},

		encryptedPassword:
		{
			type: 'string'
		},


		/* Not required- as no private/unwanted info is been sent to client
		toJSON method called before data goes to client
		remove any keys that you do not want to go to the client*/
		toJSON: function()
		{
			var obj=this.toObject();
			delete obj.password;
			delete obj.confirmation;
			delete obj.encryptedPassword;
			delete obj._csrf;
			return obj;
		}

	},


	beforeValidation: function(values, next)
	{
		console.log(values)
		if(typeof values.admin !== 'undefined')
		{
			if(values.admin === 'unchecked')
			{
				values.admin = false;
			}
			else if(values.admin[1] === 'on')
			{
				values.admin = true;
			}
		}
		next();
	},


	beforeCreate: function(values, next)
	{
		//Checks that password matched password confirmation before creating record
		if(!values.password || values.password != values.confirmation)
		{
			return next( {err: ["Password doesn\'t match password confirmation."] } );
		}



		//https://www.npmjs.org/package/bcryptjs
		var bcrypt = require('bcryptjs');

		//function will return either an error or encrypted password
		bcrypt.hash( values.password, 10, function passwordEncrypted(err, encryptedPassword)
		{
			if(err)
				return next(err);

			values.encryptedPassword = encryptedPassword;
			console.log("encryped pw= " + encryptedPassword);
			next();
		});
	}

	//}
};
