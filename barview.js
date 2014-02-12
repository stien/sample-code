/*
|--------------------------------------------------------------------------
| Side View Bar
|--------------------------------------------------------------------------
|
*/

(function()
{
	"use strict";

	var Views = window.SER.CondoViews;

	var BarView = Amber.View.extend(
	{
		template: $('#condo-level-features-template').html(),
		events:
		{
			'click .col': 'openFloorplan',
		},
		defaultBarHeight: 64,
		twoColumnCutoff: 1199,
		format: function()
		{
			_.each(this.data.condos, function(condo)
			{
				condo.sq_ft = Amber.Format.numberWithCommas(condo.sq_ft);

			});
		},
		render: function()
		{
			var self = this;
			this.trigger('before:render');
			if (this.data) //Only Render if we have data
			{

				this.format();
				this.$('.planinfo').html(_.template(this.template, this.data));
				this.$el.show();
				this.updateBarPosition(this.updateBarDimensions());
				this.delegateEvents();

				this.$('.planinfo').clearQueue().delay(200).css(
				{
					opacity: 0,
					'text-shadow':'0px 0px 18px black',
							'color': 'transparent'
			}).animate(
				{
					opacity: '.5'

				}, 100).fadeIn().animate
				({
					opacity: 1,
					'text-shadow':'none',
					'color': 'black'
			}, 300).stop();
			}

			self.trigger('after:render');
			return this;
		},
		initialize: function()
		{
			this.triangle = $('#condos-side-view .sideview-triangle');

		},
		hideView: function(){
			this.$el.addClass('inactive');
			this.triangle.addClass('inactive');
		},
		updateBarPosition: function(barHeight)
		{
			var barPosition = Views.sideview.getLevelPosition(this.level);

			barPosition -= (barHeight - 64) / 2;

			this.$el.show();
			this.triangle.show();

			if (Amber.Supports.cssanimations)
			{
				this.$el.css(
				{
					bottom: barPosition
				});

				this.triangle.css(
				{
					bottom: Views.sideview.getLevelPosition(this.level)
				});
			}
			else
			{
				this.$el.stop(true).animate(
				{
					bottom: barPosition
				}, 100, 'easeInOutQuad');

				this.triangle.stop(true).animate(
				{
					bottom: Views.sideview.getLevelPosition(this.level)
				}, 100, 'easeInOutQuad');
			}
		},
		updateBarDimensions: function()
		{
			// count
			var liCounts = Array();
			this.$('.planinfo .col').each(function(item, index)
			{
				// console.log($(this).find('li').length);
				liCounts.push($(this).find('li').length);
			});
			var maxLi = _.max(liCounts);

			//Height
			var barHeight = this.defaultBarHeight;
			barHeight = (maxLi * 18) + 20 + 5;
			barHeight = barHeight > this.defaultBarHeight ? barHeight : this.defaultBarHeight;


			//Width
			var barWidth = (liCounts.length * 190) + 30;

			//set
			this.$el.css(
			{
				height: barHeight + 'px',
				width: barWidth + 'px'
			});

			return barHeight;
		},
		findCondoById: function(id)
		{
			return _.find(this.data.condos, function(condo)
			{


				return condo.id == id;
			});
		},
		openFloorplan: function(e)
		{

			this.$('.planinfo').hide();

			this.$el.addClass('open');

	var levelIconOpenPosition = (64 * this.level) + (this.level * 10) + 30;


			var other_l = this.findCondoById($(e.currentTarget).attr('data-id')); //other level object

			var this_l = this.level;

			if (other_l.other_level!=undefined){

				var otre_level = other_l.other_level.level;

			} else {

			var otre_level = 0;

			}

			var self = this;
			$('.level').each(function()
			{


				var levelNum = $(this).attr('data-level');


				if (levelNum!=otre_level && levelNum!=this_l){
				$("#level-" + levelNum).animate(
				{
					bottom : '+=500px',
					opacity: 0
				}, 300, 'easeInOutExpo');

				}
			});

			Views.bar.triangle.css(
			{
				bottom: levelIconOpenPosition
			});

			Views.floorplan.data = this.findCondoById($(e.currentTarget).attr('data-id'));
			Views.floorplan.setElement(this.$('.floorplan'), true);

			Views.floorplan.$el.css(
			{
				display: 'block',
				opacity: 0
			});


			setTimeout(function()
			{

				Views.floorplan.render();

				Views.floorplan.$el.animate(
				{
					opacity: 1
				}, 300, 'easeInOutExpo');
			}, 300);

		}
	});

	Views.bar = new BarView();
})();
