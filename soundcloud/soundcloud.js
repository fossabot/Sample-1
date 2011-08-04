var SoundcloudResolver = Tomahawk.extend(TomahawkResolver,
{
	cleanTitle: function(artist, title){
		if (title.search("\\[|\\]|\\(|\\)|\\*|\\+") != 1){
			title = title.replace(new RegExp("\\[|\\]|\\(|\\)|\\*|\\+", "gi"), "");
		}
		var stripArtist = new RegExp("\\W*[by]*[the]*\\W*"+artist+"\\W*", "gi");
		var stripAppendingQuotes = new RegExp("\"", "gi");
		if (title.search(new RegExp(artist, "gi")) != -1 && title.search(new RegExp(title, "gi")) != 1){
			if (title.search(stripArtist) != -1){
				title = title.replace(stripArtist, "").trim();
				if (title.search(stripAppendingQuotes) == title.length - 1  && title.search(stripAppendingQuotes) != 0){
					title = title.replace(stripAppendingQuotes, "").trim();
				}
				if (title.search(stripAppendingQuotes) != title.length - 1  && title.search(stripAppendingQuotes) == 0){
					title = title.replace(stripAppendingQuotes, "").trim();
				}
			}
			return title;
		}
	},
	settings:
	{
		name: 'Soundcloud Resolver',
		weight: 85,
		timeout: 5
	},
	apiCall: function(artist, track)
	{
		artist = encodeURIComponent(artist).replace(/\%20/g,'\+').trim();
		track = encodeURIComponent(track).replace(/\%20/g,'\+').trim();
		var soundcloudUrl = "http://api.soundcloud.com/tracks.json?consumer_key=TiNg2DRYhBnp01DA3zNag&filter=streamable&q="+artist+"+"+track;
		return JSON.parse(Tomahawk.syncRequest(soundcloudUrl));
	},
	parseSongResponse: function( qid, artist, responseString )
	{
	var results = new Array();
	if (responseString != null){
		for (i=0;i<responseString.length;i++){
			var result = new Object();
			result.artist = artist;
			if (this.cleanTitle(artist, responseString[i].title)){
				result.track = this.cleanTitle(artist, responseString[i].title);
			}
			else {
				continue;
			}
			result.year = responseString[i].release_year;
			result.source = "SoundCloud";
			result.url = responseString[i].stream_url+".json?client_id=TiNg2DRYhBnp01DA3zNag";
			result.mimetype = "audio/mpeg";
			result.bitrate = 128;
			result.duration = responseString[i].duration/1000;
			result.score = 1.00;
			results.push(result);
		}
		var return1 =  {
			qid: qid,
			results: results
		};
		return return1;
	}
	else{
		return;
	}
	},
	resolve: function( qid, artist, album, title )
	{
		return this.search( qid, artist, album, title );
	},
	search: function( qid, artist, album, title )
	{
		var searchResult = this.apiCall(artist, title);
		return this.parseSongResponse( qid, artist, searchResult );
	}
});

Tomahawk.resolver.instance = SoundcloudResolver; 
