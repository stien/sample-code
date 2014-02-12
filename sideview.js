/*
|--------------------------------------------------------------------------
| Side View View
|--------------------------------------------------------------------------
|
*/

(function()
{
	"use strict";

	var Views = window.SER.HomeViews;

	var SideViewView = Amber.View.extend(
	{
		$el: $('#homes-side-view'),
		template: $('#sideview-template').html(),
		events:
		{
			'click .back': 'clickBack',
			'click .level': 'clickLevel',
			'mousemove': 'moveLevelBar'
		},
		closestLevel:
		{},
		format: function()
		{
			this.data.sq_ft = Amber.Format.numberWithCommas(this.data.sq_ft);
			return this;
		},
		render: function()
		{
			this.format();

			this.$el.html(_.template(this.template, this.data));

			return this;
		},
		initialize: function()
		{
			this.setElement(this.$el, true);

			this.render();

			var self = this;
			this.$('.level').each(function()
			{
				var levelNum = $(this).attr('data-level');
				$(this).css(
				{
					bottom: self.data.levels[levelNum].position + 'px'
				});
			});

			Views.bar.$el = this.$('.level-bar');
			Views.bar.initialize();
		},
		clickBack: function()
		{
			this.transition(Views.sitemap, 'back');
		},
		findClosestLevelIconToMouse: function(pageY)
		{
			var mouseToBottom = Math.round(this.$el.height() - (pageY - this.$el.offset().top)),
				halfLevelIconHeight = 32;

			_.each(this.data.levels, function(level)
			{
				//Calcualte the distance to the center of each level icon
				level.distance = Math.abs(level.position - mouseToBottom + halfLevelIconHeight);
			});

			this.closestLevel = _.min(this.data.levels, function(level)
			{
				return level.distance;
			});

			return this;
		},
		moveLevelBar: function(e)
		{

			if ($('.level.selected').length === 0 && !Views.bar.$el.hasClass('open'))
			{

				//Save the current level so know if it changed
				var previousLevel = this.closestLevel.level || -1;

				//Find the closest level to mouse Y
				this.findClosestLevelIconToMouse(e.pageY);

				// If the level has changed update the Bar
				if (previousLevel !== this.closestLevel.level)
				{
					Views.bar.data = this.closestLevel;
					Views.bar.render();
				}

				if (this.closestLevel.distance > 100)
				{
					Views.bar.$el.addClass('inactive');
					Views.bar.triangle.addClass('inactive');
				}
				else
				{
					Views.bar.$el.removeClass('inactive');
					Views.bar.triangle.removeClass('inactive');
				}
			}
		},
		clickLevel: function(e)
		{

			var targetLeveLNumber = $(e.target).attr('data-level');
			$( ".floorplan-image" ).draggable();

			Views.bar.data = _.find(this.data.levels, function(level)
			{
				return level.level == targetLeveLNumber;
			});

			if (!Views.bar.$el.hasClass('open'))
			{

				$(e.target).siblings('.level').removeClass('selected');
				$(e.target).toggleClass('selected');

				if ($('.level.selected').length > 0)
				{
					Views.bar.render();
				}
			}
			else
			{
				$('.level').removeClass('selected');
				$(e.target).toggleClass('selected');
				var levelIconOpenPosition = (64 * Views.bar.data.level) + (Views.bar.data.level * 10) + 30;

				Views.bar.triangle.css(
				{
					bottom: levelIconOpenPosition
				});

				//Determine which way we're going
				var transitionDirection = Views.floorplan.data.level > targetLeveLNumber ? 1 : -1;

				//Update the Floorplan View Data
				Views.floorplan.data = Views.bar.data;
				Views.floorplan.$el = this.$('.floorplan');

				var $floorplan;

				$floorplan = Views.floorplan.$el.find('.floorplan-image');

				/*--------------------------------------------------------------------------
                | Transition from One Floor to Another
                */
				if (Amber.Supports.cssanimations)
				{

					var scaleSize = 0.7,
						scaleIn = 1 + (transitionDirection * scaleSize),
						scaleOut = 1 - (transitionDirection * scaleSize),
						transitionTime = 250,
						transitionEase = 'all ' + transitionTime + 'ms ease-in-out';


					$floorplan.css(
					{
						'transition': transitionEase,
						'transform': 'scale(' + scaleIn + ')',
						'opacity': 0
					});

					setTimeout(function()
					{
						Views.floorplan.render();
						Views.floorplan.initialize();

						$floorplan = Views.floorplan.$el.find('.floorplan-image');

						$floorplan.css(
						{
							'transition': 'all 0 ease 0',
							'transform': 'scale(' + scaleOut + ')',
							'opacity': 0
						});
						//Delay the execution slightly to ensure styles
						//are applied in the correct order
						setTimeout(function()
						{
							//Load HTML

							//Animate Back in
							$floorplan.css(
							{
								'transform': 'scale(1)',
								'opacity': 1,
								'transition': transitionEase
							});
						});


					}, transitionTime);
				}
				else
				{

					$floorplan.animate(
					{
						top: '100%'
					}, 250, 'easeInOutExpo', function()
					{
						$floorplan.css(
						{
							top: '-100%'
						});
						Views.floorplan.render();
						Views.floorplan.initialize();
						$floorplan.animate(
						{
							top: 0
						}, 250, 'easeInOutExpo');
					});
				}
			}
		}
	});
	Views.sideview = new SideViewView();
})();
