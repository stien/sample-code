 <div class="blog-content"> <!-- blog content -->
                    

<?php // Get RSS Feed(s) by Stien for Zambezi
	 // Popchips had a secondary blog and they wanted to feed the posts into one section of their "Poplive" page.

include_once(ABSPATH . WPINC . '/feed.php'); 					//grab the RSS container functions for mWP
$filter_out=array("/<img[^>]+\>/","/<a .*?>(.*?)<\/a>/");    	// scoop just src="image"


// Get a SimplePie feed object from Popships (feedburner)
$rss = fetch_feed('http://feeds.feedburner.com/popchips');
if (!is_wp_error( $rss ) ) : // Checks that the object is created correctly 
    
    $maxitems = $rss->get_item_quantity(5); 

    // Build an array of all the items, starting with element 0 (first element).
    $rss_items = $rss->get_items(0, $maxitems); 
endif;
?>


    <?php if ($maxitems == 0) echo '<li>No items.</li>';
    else
    // Loop through each feed item and display each item as a hyperlink.
    foreach ( $rss_items as $item ) : ?>
    

   <!-- gettign the data through simplepie -->
   
   
	
	<div class='blog-post'>
	

		<div class='content'>
		
    
       <?php
		
		$s = $item->get_content();
		$matches = array();
		$t = preg_match('/<img (.*?)alt=/s', $s, $matches); // just making sure they fit the layout since there's no 				
															// thumbnails, we grabbing the first gallery image
		echo '<img '.$matches[1].' style="max-width:220px; 
	margin-bottom: 15px; 
	border: 2px solid #fff;"  align="right" />';
		
		
		?>
        
     <!-- regular ole WP post loop -->
        
		<div class='blog-post-text'>
		
			<h4><?php echo esc_html( $item->get_title() ); ?></h4>
			
			<p><strong>posted on <?php echo esc_html( $item->get_date('F j Y') ); ?> by popchips</strong></p>

			
						<p><?php 
						
						
						
						echo substr(preg_replace($filter_out, "", $item->get_content()),0,180); ?>... <a href='<?php echo esc_url( $item->get_permalink() ); ?>'>--> continue reading</a></p>
						
					
				
		
		</div>
		
		
		<div class='clear'></div>
		
		</div>
		
		<div class='share-btns'>
                                                
        <div class='addthis'>  <!-- social addthis stuff -->
                        
        	<div class='addthis_toolbox addthis_default_style 
                                 addthis:url='http://http://popchips.com/poplive/'
                                 addthis:title='<?php echo esc_html( $item->get_title() ); ?>'
                                 addthis:description='<?=substr(mysql_real_escape_string(strip_tags($feed['post_excerpt'])),0,200) ?>'
                                 <?php ADD_THIS_CONF ?> 
                                 >
                            
            	<a href='http://www.addthis.com/bookmark.php?v=250&amp;pubid=xa-4df292be11a0bd28' class='addthis_button_compact'><img src='http://popchips.com/wp-content/themes/popchips/images/share-btn.png' alt='Share' /></a>
                                
                <script type='text/javascript' src='http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4df292be11a0bd28'></script>
                                
            </div>
                            
        </div>
		
		

		<div class='clear'></div>
		
		</div>
				
	</div>
	
	<div class='clear'></div>
	
   
   
   
   <? // and this is the way I have to end this story he was only 17... ?>
   
    
    <?php endforeach; ?>
						
						
                    
                    </div> <!-- endblog content -->
