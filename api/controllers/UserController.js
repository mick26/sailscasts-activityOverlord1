/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 *				https://www.youtube.com/watch?v=4Gbc9ZA2-YY&list=PLWsZeJCry-F4K4iRImeB3-i0S5mw9Ak-W
 */

module.exports = {

	//new action
	// '' because new is a reserved word
	'new': function(req, res)
	{

		//res.locals.flash is available from the views
		//but res.locals only lasts until the next request
		//so issue when redirect back to new.ejs so place before res.view()
//		res.locals.flash = _.clone(req.session.flash);		//
		res.view();											//render the view new.ejs - dont want flash message again unless another error
//		res.session.flash={};								//reset to empty object-unless another error occurs after view is rendered
	},

	//create action

	create: function(req, res, next)
	{
		//create a user with the params sent from
		//signup form->new.ejs
		//User.js was created 'U' upper case
		User.create( req.params.all(), function userCreated(err, user)
		{
			//Error
			//If there is an error 
			if(err)
			{
				console.log(err);
				//
				//req.session is a place we can store session variables (while browser is open)
				//req.session.flash is not available to views but res.locals.flash is
	
				req.session.flash =
				{
					err: err.ValidationError
				}

				//if error redirect back to signup page				
				return res.redirect('/user/new');
			}
			
			//Log user In
			req.session.authenticated = true;
			req.session.User = user;

			//Success - created user
			//We are using Action Blueprints
			//After successfully creating the user
			//redirect to the show action
			//res.json(user);
			res.redirect('/user/show/'+user.id);
			
			//	req.session.flash = {};						//reset to empty object if success
		});
	},


	//render the profile view (e.g. /views/show.ejs)
	show: function(req, res, next)
	{
		User.findOne(req.param('id'), function foundUser(err, user)
		{
			if(err)
				return next(err);

			if(!user)
				return next();

			//render the view passing the user as an object
			res.view( 
				{ user: user 
				}
			);
		});
	},


	//index action
	index: function(req, res, next)
	{
		//log the current date and time
	
	/*
		console.log(new Date());
		console.log(req.session.authenticated);
	*/

		//get an array of all users in hte user collection
		//find returns an array
		//Either returns an error or our user
		User.find(function foundUsers(err, users)
		{
			if(err)
				return next(err);

			//render the view passing the user as an object
			//pass the array down to the /views/index.ejs page
			res.view
			({
				users: users
			});
		});
	},

	//
	edit: function(req, res, next)
	{
		//find the user from the id passed in via params
		//either error or get user back
		User.findOne(req.param('id'), function foundUser(err, user)
		{
			if(err)
				return next(err);

			if(!user)
				return next("User doesn\'t exist.");

			res.view({
				user: user
			});
		});
	},

	//Process the info from edit view
	update: function(req, res, next)
	{

		if(req.session.User.admin)
		{
			var userObj=
			{
				name: req.param('name'),
				title: req.param('title'),
				email: req.param('email'),
				admin: req.param('admin')
			}
		}
		else
		{
			var userObj=
			{
				name: req.param('name'),
				title: req.param('title'),
				email: req.param('email')
			}
		}

		//User.update(req.param('id'), req.params.all(), function userUpdated(err)
		User.update(req.param('id'), userObj, function userUpdated(err)
		{
			//error
			if(err)
			{
			//	return res.redirect('/user/edit/' + req.param('id'));
				return res.redirect('/user/edit/' + req.param('id'));
				console.log("Update Error");
			}

			//success
			console.log("Update Success redirect to show+req.param(id)");
	//		res.redirect('/user/show/' + req.param('id'));
	//		res.redirect('/user/show/' + 4);
			res.redirect('/user/show/'+ req.param('id'));

		});
	},


	//
	destroy: function(req, res, next)
	{
		User.findOne(req.param('id'), function foundUser(err, user)
		{
			//error
			if(err)
				return next(err);

			if(!user)
				return next("User doesn\'t exist.");


			User.destroy(req.param('id'), function userDestroyed(err)
			{
				if(err)
					return next(err);
			});

			res.redirect('/user');
		});
	}
};




