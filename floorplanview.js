/*
|--------------------------------------------------------------------------
| FLoorplan View
|--------------------------------------------------------------------------
|
*/

(function()
{
	"use strict";

	var Views = window.SER.CondoViews;

	var FloorplanView = Amber.View.extend(
	{
		template: $('#condo-floorplan-template').html(),
		events:
		{
			'click .btn-close': 'closeView',
			'click .interior-level': 'changeLevel'

		},
		format: function()
		{
			this.data.sq_ft = Amber.Format.numberWithCommas(this.data.sq_ft);
			this.data.bathrooms = Amber.Format.stripTrailingZero(this.data.bathrooms);
			return this;
		},
		render: function()
		{

			this.trigger('before:render');
			this.format().$el.html(_.template(this.template, this.data));

			//Update Triangle
			var levelIconOpenPosition = (64 * this.data.level) + (this.data.level * 10) + 30;
			Views.bar.triangle.css(
			{
				bottom: levelIconOpenPosition
			});

			Amber.Vent.on('condo:closeFloorplan', _.bind(this.closeView, this));
			Amber.Vent.on('condo:changePlanLevel', _.bind(this.changeLevel, this)); //from sideview

			this.trigger('after:render');

			return this;
		},
		initialize: function()
		{
			this.setElement(this.$el, true);
		},
		getLevelPosition: function(num)
		{
			return (num * 80) + 0;
		},
		closeView: function(e)
		{

			$('.level').removeClass('floorplan-open');
			$('.level').removeClass('selected');

			var this_one = this.data.level;

			if (this.data.other_level!=undefined){

				var other_one = this.data.other_level.level;
			} else {

			var other_one = 0;

			}
			var self = this;

			$('.level').each(function()
			{

					// running the icons minus our target level
				var levelNum = $(this).attr('data-level');

				if (levelNum!=other_one && levelNum!=this_one){
				$("#level-" + levelNum).animate(
				{
					bottom : '-=500px',
					opacity: 1
				}, 300, 'easeInOutExpo');

				}
			});


			this.$el.animate(
			{
				opacity: 0
			}, 100, function()
			{
				Views.bar.$el.removeClass('open');

				$(this).empty();
				Views.floorplan.$el.hide();
				setTimeout(function()
				{
				Views.bar.render();

				}, 300);
			});
		},
		findCondo: function(residence_number, level)
		{
			return _.find(Views.sideview.data.levels[level], function(level)
			{
				return level.residence_number == residence_number;
			});
		},
		changeLevel: function(e)
		{
			if (Views.bar.$el.hasClass('open')) {

			var targetLevel = $(e.currentTarget).attr('data-level');

			if (targetLevel == undefined) {

				targetLevel = (e);
			}
			console.log(targetLevel);


			if (targetLevel != this.data.level)
			{
				var transitionDirection = this.data.level > targetLevel ? 1 : -1;

				this.data = this.findCondo(this.data.residence_number, targetLevel);

				var $floorplan = this.$('.floorplan-image'),
					self = this;


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
						self.render();
						self.initialize();

						$floorplan = self.$el.find('.floorplan-image');

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
						self.render();
						self.initialize();
						$floorplan.animate(
						{
							top: 0
						}, 250, 'easeInOutExpo');
					});
				}
			}
}
		},
		RemotechangeLevel: function(e)
		{

			 var targetLevel = (e);
			 var targetLeveLNumber = targetLevel;

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
				var levelIconOpenPosition = (64 * targetLevel) + (targetLevel * 10) + 30;
				Views.bar.triangle.css(
				{
					bottom: levelIconOpenPosition
				});


			}

			//////////////////////////////////


			if (targetLevel != this.data.level)
			{

				Views.bar.$('.planinfo').hide();

				var transitionDirection = this.data.level > targetLevel ? 1 : -1;

				this.data = this.findCondo(this.data.residence_number, targetLevel);

				var $floorplan = this.$('.floorplan-image'),
					self = this;


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
						self.render();
						//self.initialize();

						$floorplan = self.$el.find('.floorplan-image');

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
						self.render();
						self.initialize();
						$floorplan.animate(
						{
							top: 0
						}, 250, 'easeInOutExpo');
					});
				}
			}

		}
	});

	Views.floorplan = new FloorplanView();
})();
