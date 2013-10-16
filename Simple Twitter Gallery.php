
            <ul id="news" style="margin-left:685px; display: none">	
            <!-- the twitter loop -->			
							
            <?php 
			
	// Avatar de Twitter de Stien de....
	// Popchips wanted to load thier celeb endorsement tweets into a small area
	// at the footer of the home page.
	// We created a backend page in the WP admin panel to load the Tweeter Username, Tweet, and Date Added
	
	function TwitterAvatar($username) {												//.. simple function
   	 $xml = simplexml_load_file("http://twitter.com/users/".$username.".xml");
    	return $xml->profile_image_url;
	}
	

	$record_sql="select * from wp_posts where post_type='FPtweets'";      // load up all the tweets from the database
	$list_res=mysql_query($record_sql)or die(mysql_error());
	while($tw_feed=mysql_fetch_array( $list_res )) 
						{

	?>			
					<li>
						
					
			<div class="box3-plive-tweet" onClick="window.open('http://twitter.com/#!/<? echo $tw_feed['post_excerpt'];?>');"><div class="box3-plive-img">
            
           <?php $twittertar = $tw_feed['post_excerpt']; ?> <!-- grab the tweet -->
            
            <img src="<?=TwitterAvatar($twittertar)?>" /></div> <!-- grab the avatar -->
            
            <div class="box3-plive-txt">
            
            <p class="tweetTxt"> <!-- protect ourselves form ourselves -->
            
			<? if(empty($tw_feed['post_content'])==FALSE) { echo substr(strip_tags($tw_feed['post_content']),0,65); } ?>...<b class="readmore">read more</b></p><p class="tweetName">@<?=$tw_feed['post_excerpt']?></p>
            
            </div>
            	</div>
           
           
            </li>	
            
            
            <!-- eo loop -->
            
            <?php } ?>
				</ul>
            
            
            
	   </div>

	   <!-- end #popLive --></div>
	   
	   <!-- hid the tweets until after php loads them all, then faded them in  -->
	   
	      <script type="text/javascript">
		
	   $(document).ready(function(){
			 $('#news').fadeIn(3000);
	
					$('#news').innerfade({
						
						speed: 'slow',
						timeout: 6000,
						type: 'random',
						containerheight: '1em'
					});
			});
  	</script>
