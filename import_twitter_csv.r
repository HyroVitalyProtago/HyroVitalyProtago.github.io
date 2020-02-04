library(rjson) # https://cran.r-project.org/web/packages/rjson/rjson.pdf
library(rvest) # https://cran.r-project.org/web/packages/rvest/rvest.pdf
library(httr) # POST
# http://edutechwiki.unige.ch/fr/Web_scraping_avec_R

tweets <- read.csv("~/Downloads/twitter_archive/tweets.csv", header = TRUE, sep = ",", colClasses=c("tweet_id"="character", "in_reply_to_status_id"="character"))

# example of json read
# json_file <- "https://publish.twitter.com/oembed?url=https://twitter.com/_/status/697753060496506880"
# json_data <- fromJSON(file=json_file)
# ---
# $url : "https://twitter.com/KenneyNL/status/697753060496506880"
# $author_name : "Kenney"
# $author_url : "https://twitter.com/KenneyNL"
# $html : "<blockquote class=\"twitter-tweet\"><p lang=\"en\" dir=\"ltr\">Any idea? My math skills SUCK. <a href=\"https://t.co/IooUBW8lhw\">pic.twitter.com/IooUBW8lhw</a></p>&mdash; Kenney (@KenneyNL) <a href=\"https://twitter.com/KenneyNL/status/697753060496506880?ref_src=twsrc%5Etfw\">February 11, 2016</a></blockquote>\n<script async src=\"https://platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>\n"
# $width : 550
# $height : NULL
# $type : "rich"
# $cache_age : "3153600000"
# $provider_name : "Twitter"
# $provider_url : "https://twitter.com"
# $version : "1.0"
# ---

# example of web scraping
# tw <- html("https://twitter.com/KenneyNL/status/697753060496506880")
# html_nodes(tw, ".tweet-text")
# toString(html_nodes(tw, ".tweet-text")[1])
# get content of p node
# gsub("</p>", "", gsub("<p[^>]*>", "", toString(html_nodes(tw, ".tweet-text")[1])))

# how try-catch works
# result <- tryCatch({
#    fromJSON(file="https://publish.twitter.com/oembed?url=https://twitter.com/_/status/1136849411433066496")
# }, warning = function(w) {
#     print(w)
# }, error = function(e) {
#     print(e)
# }, finally = {
#     
# })

# https://mobile.twitter.com/Moike_the_Squid/status/1131413137951846400
# twitter video : https://video.twimg.com/ext_tw_video/1131411922165817344/pu/vid/1280x720/ory3RShnZGhq_kwo.mp4?tag=9
# POST to https://twdown.net/download.php URL https://mobile.twitter.com/Moike_the_Squid/status/1131413137951846400
#  get table and extract url
# response <- POST("https://twdown.net/download.php",body=list(URL = 'https://mobile.twitter.com/Moike_the_Squid/status/1131413137951846400'), encode="form")
# responseHTML <- read_html(response)
# videoLinksHTML <- html_nodes(responseHTML, "[href][onclick]")
# videoLinks = list()
#for (linkHTML in videoLinksHTML) {
#	link <- strsplit(html_attr(linkHTML, 'onclick'), "'")[[1]][2]
#	def <- strsplit(link, '/')[[1]][8]
#	videoLinks[[def]] <- link
#}
# videoLinks[[1]] <=> videoLinks[['1280x720']] = "https://video.twimg.com/ext_tw_video/1131411922165817344/pu/vid/1280x720/ory3RShnZGhq_kwo.mp4?tag=9"


for (i in 1:867) {
	print(i)
		
	timestamp <- strsplit(toString(tweets$timestamp[i]), " ")[[1]]
	time <- strsplit(timestamp[2], ":")[[1]]
	slug <- paste0(time[1], time[2], time[3])
	
	lines <- c(
		"---",
		"layout: micropubpost",
		"title: ''",
		"tags: note",
		"language: en",
		paste0("tweet_id: ",tweets$tweet_id[i]),
		paste0("date: ",tweets$timestamp[i]),
		paste0("slug: '",slug,"'")
	)
	
	in_reply_to_status_id <- toString(tweets$in_reply_to_status_id[i])
	if (in_reply_to_status_id != "") {
		json_file <- paste0("https://publish.twitter.com/oembed?url=https://twitter.com/_/status/", in_reply_to_status_id)
		json_data <- fromJSON(file=json_file)
		
		user_id <- strsplit(json_data$author_url, "/")[[1]][4]
		
		session <- html_session(paste0("https://twitter.com/",user_id,"/profile_image?size=original"))
		user_avatar <- session$url
		
		user_name <- json_data$author_name
	
		tweet <- html(paste0("https://twitter.com/_/status/", in_reply_to_status_id))
		# @todo get the text of the tweet before the one with .TweetTextSize--jumbo class
		# @todo replace a links of twitter users
		# @todo add quotes paste0("'", ..., "'") and escape them inside gsub("'", "''", ...) # https://yaml-multiline.info/
		user_text <- paste0("'", gsub("'", "''",gsub("</p>", "", gsub("<p[^>]*>", "", toString(html_nodes(tweet, ".tweet-text")[1])))), "'")
		
		lines <- c(
			lines,
			paste0("in_reply_to_status_id: ",tweets$in_reply_to_status_id[i]),
			paste0("in_reply_to_user_id: ",tweets$in_reply_to_user_id[i]), # @toremove
			paste0("user_id: ", user_id),
			paste0("user_name: ", user_name),
			paste0("user_avatar: ", user_avatar),
			paste0("user_text: ", user_text)
		)
	}
	
	if (!is.na(tweets$retweeted_status_id[i]) & !is.null(tweets$retweeted_status_id[i]) & tweets$retweeted_status_id[i] != "") {
		lines <- c(
			lines,
			paste0("retweeted_status_id: ",toString(tweets$retweeted_status_id[i])),
			paste0("retweeted_status_user_id: ",toString(tweets$retweeted_status_user_id[i])),
			paste0("retweeted_status_timestamp: ",tweets$retweeted_status_timestamp[i])
		)
	}
	
	if (tweets$expanded_urls[i] != "") {
		if (is.list(tweets$expanded_urls[i])) {
			lines <- c(
				lines,
				paste0("expanded_urls: ",tweets$expanded_urls[i])
			)
		} else {
			url <- tweets$expanded_urls[i]
			if (grepl("^https://twitter.com.*/video/1$", url)) {
				response <- POST("https://twdown.net/download.php",body=list(URL = 'https://mobile.twitter.com/Moike_the_Squid/status/1131413137951846400'), encode="form")
				responseHTML <- read_html(response)
				videoLinksHTML <- html_nodes(responseHTML, "[href][onclick]")

				videoLinks = list()
				for (linkHTML in videoLinksHTML) {
					link <- strsplit(html_attr(linkHTML, 'onclick'), "'")[[1]][2]
					def <- strsplit(link, '/')[[1]][8]
					videoLinks[[def]] <- link
				} # videoLinks[[1]] <=> videoLinks[['1280x720']] = "https://video.twimg.com/ext_tw_video/1131411922165817344/pu/vid/1280x720/ory3RShnZGhq_kwo.mp4?tag=9"
				url <- toJSON(videoLinks)
			}
			lines <- c(
				lines,
				paste0("expanded_urls: ", url)
			)
		}
	}
	
	lines <- c(
		lines,
		"---",
		toString(tweets$text[i])
	)

	fileConn <- file(paste0("~/tweets2/", timestamp[1],"-",slug,".md"))
	writeLines(lines, fileConn)

	# writeLines(c(
		# "---",
		# "layout: micropubpost",
		# "title: ''",
		# "tags: note",
		# "language: en",
		# paste0("tweet_id: ",tweets$tweet_id[i]),
		# paste0("in_reply_to_status_id: ",tweets$in_reply_to_status_id[i]),
		# paste0("in_reply_to_user_id: ",tweets$in_reply_to_user_id[i]),
		# paste0("date: ",tweets$timestamp[i]),
		# paste0("retweeted_status_id: ",tweets$retweeted_status_id[i]),
		# paste0("retweeted_status_user_id: ",tweets$retweeted_status_user_id[i]),
		# paste0("retweeted_status_timestamp: ",tweets$retweeted_status_timestamp[i]),
		# paste0("expanded_urls: ",tweets$expanded_urls[i]),
		# paste0("user_id: ", user_id),
		# paste0("user_name: ", user_name),
		# paste0("user_avatar: ", user_avatar),
		# paste0("user_text: ", user_text),
		# paste0("slug: '",slug,"'"),
		# "---",
		# toString(tweets$text[i])),
	# fileConn)
	
	close(fileConn)
}

# in terminal to remove lines with NA :  sed -i '' '/NA/d' /Users/ludovicdavid/tweets/*
# interminal to remove empty expanded urls : sed -i '' '/expanded_urls: $/d' /Users/ludovicdavid/tweets/*
