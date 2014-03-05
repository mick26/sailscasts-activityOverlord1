# activityOverlord1

#Based on the SailsJS tutorials at: http://www.youtube.com/watch?v=1H0UfbGdwd8&list=PLWsZeJCry-F4K4iRImeB3-i0S5mw9Ak-W

****************************************************************
I used the latest version of SailsJS v0.10
The tutorial uses an older version
****************************************************************

When I created the sails project using sails new project_name --linker 
The command --linker did nothing.

I had to create the .tmp directory manually
In Windows to create .tmp directory you need to create a directory .tmp. 
Windows then removes the last .
Could also have created the .tmp directory from the command prompt

Gruntfile.js is also not been used.
I had to add CSS and JS files to layout.ejs manually and place them inside:
/.tmp/public/linker/css
/.tmp/public/linker/styles

Also images had to be placed manually into the directory:
 /.tmp/public/images 


