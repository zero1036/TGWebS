App.Routers.Main = Backbone.Router.extend({

	// Hash maps for routes
	routes : {
		"": "index",
		"/teams" : "getTeams",
		"/teams/:country" : "getTeamsCountry",
		"/teams/:country/:name" : "getTeam",
		"*error" : "fourOfour"
	},

	index: function(){
		// Homepage 
		var team1 = new App.Models.Team({
			name : "name1"
		});
		console.log(team1.get("name")); // prints "name1"

		// "name" attribute is set with a new value
		team1.set({
			name : "name2"
		});
		console.log(team1.get("name")); 

		var teams = new App.Collections.Teams();
		
		teams.add(team1);
		teams.add(new App.Models.Team({
			name : "Team B"
		}));
		teams.add(new App.Models.Team());
		teams.remove(team1);

		console.log(teams.length);
	},

	getTeams: function() {
		// List all teams 
	},
	getTeamsCountry: function(country) {
		// Get list of teams for specific country
	},
	getTeam: function(country, name) {
		// Get the teams for a specific country and with a specific name
	},	
	fourOfour: function(error) {
		// 404 page
	}
});
