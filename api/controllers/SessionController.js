/**
 * >sails generate controller session
 *
 * SessionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var bcrypt=require('bcryptjs');


module.exports = 
{


	'new': function(req, res)
	{

	/*
		var oldDateObj = new Date();
		var newDateObj = new Date(oldDateObj.getTime() + 60000);		//add 60 sec to previous date
		req.session.cookie.expires = newDateObj;
		req.session.authenticated = true;
		console.log(req.session);
	*/
		res.view('session/new');										//sign page
	},



	//create 
	create: function(req, res, next)
	{
		//check for email & pw in params sent via form if none redirect
		//back to signin form
		if( !req.param('email')|| !req.param('password'))
		{
			//return next( { err:["Password doesn\'t match password confirmation."] });
			var usernamePasswordRequiredError=[{ name:'usernamePasswordRequired', message:"You must enter both a username & password."}];

			//Remember that err is the object being passed down(aka flash.err) whose value is another object with 
			//the key of usernamePasswordRequiredError
			req.session.flash=
			{
				err:usernamePasswordRequiredError
			}

			res.redirect('/session/new');
			return;
		}

		//Try to find user by their email address
		User.findOneByEmail(req.param('email')).done(function(err, user)
		{
			if(err)
				return next(err);

			//if no user is found..
			if(!user)
			{
				var noAccountError=[ 
				{
					name: 'noAccount', 
					message: 'The email address' + req.param('email') +' not found.'
				}]

				req.session.flash=
				{
					err:noAccountError
				}
				res.redirect('/session/new');
				return;
			}

			//Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid)
			{
				if(err)
					return next(err);

				//if the password from the form doesn't match the password from the db...
				if(!valid)
				{
					var usernamePasswordMissmatchError=[ 
					{ 
						name:'usernamePasswordMissmatch', 
						message:'Invalid username and password combination.' 
					}]

					req.session.flash = 
					{
						err: usernamePasswordMissmatchError
					}
					res.redirect('/session/new');
					return;
				}

				//Log user in
				req.session.authenticated = true;
				req.session.User= user;

				//admin is true
				//If user is also an Admin redirect to the user list (e.g. /views/user/index.ejs)
				//This is used with config/policies.js file
				if(req.session.User.admin)
				{
					res.redirect('/user');
					return;
				}

				//admin is false
				//Redirect to their profile page (e.g. /views/user/show.ejs)
				res.redirect('/user/show/' + user.id);
			});
		});

	},

	destroy: function(req, res, next)
	{
		//wipe out the session (logout)
		req.session.destroy();

		//redirect the browser to sign-in screen
		res.redirect('/session/new');
	}

};
