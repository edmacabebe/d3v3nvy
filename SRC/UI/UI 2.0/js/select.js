/*!
 * IWCMS Dropdown Conponent
 * https://integrawatch.com/
 *
 * Date: 2017-05-05
 */
jQuery(document).ready(function(event) {
	//custom css expression for a case-insensitive contains()
	jQuery.expr[':'].Contains = function(a,i,m){
		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};

	var input = jQuery('input.select, .multiselect-container'),
		taggedInputs = [],
		options = [];

	//customize input
	// input.attr("placeholder", "Please Select"); ///////////////////////// to get a default placeholder //////////////////////////////
	input.after('<i class="fa fa-caret-down"></i>');
	
	//hide selection
	input.next('i').after('<ul class="selection"></ul>');
	selection = jQuery('ul.selection');
	selection.hide();

	//mock options only for custom select
	options = [
		{
			'label': 'Option 1',
			'value': 'option1' 
		},
		{
			'label': 'Option 2',
			'value': 'option2' 
		},
		{
			'label': 'Option 3',
			'value': 'option3' 
		}
	];
	//console.log('option', options);
	options.forEach(function(option) {
		selection.append('<li data-type="'+ option.label +'">'+ option.label +'</li>');
	});

	input.on('click', function(e) {
		jQuery(this).next('i').next('ul').fadeIn();
	});

	selection.on('mouseleave', function() {
		jQuery(this).fadeOut();
	});

	//add option to input
	jQuery('.selection li').click(function(e) {
		//console.log('e', e);
		var option = jQuery(this).attr('data-type'),
			selected = jQuery(e.currentTarget.parentNode).prev('i').prev('input'),
			multiselect = jQuery(e.currentTarget.parentNode).prev('i').prev('.multiselect-container');

		//if element is dropdown	
		if(selected.hasClass('select')) {
			jQuery(e.currentTarget.parentNode).prev('i').prev('input').val(option);
		} else {
			jQuery(this).parent().prev().prev().find('input').val('');

			if (jQuery.inArray(option, taggedInputs) != -1) {
				console.log('Item has already been selected');
			}
			else {
				taggedInputs.push(option);
				multiselect.prepend('<div class="taggedInput" data-value="' + option + '">' + option + '<i class="fa fa-times remove" aria-hidden="true"></i></div>');
			}
			console.log('taggedInputs', taggedInputs);	
		}	

		selection.hide();
	});

	//multiselect deature
	jQuery('input.select, input.multiselect').change(function(e) {
		//console.log(e);
		var value = jQuery(this).val(),
		list = (e.currentTarget.attributes.class.value === 'select') ? jQuery(this).next('i').next('ul') : jQuery(this).parent('.multiselect-container').next('i').next('ul');

		if(value) {
			jQuery(list).find("li:not(:Contains(" + value + "))").slideUp();
			jQuery(list).find("li:Contains(" + value + ")").slideDown();
		} else {
			jQuery(list).find("li").slideDown();
		}
		return false;
	})
	.keyup( function () {
		//fire the above change event after every letter
		jQuery(this).change();
	});

	//remove multiselect values through click
	jQuery('.multiselect-container').on('click', function(e) {
		//console.log('e', e);
		jQuery(this).find('input').focus();
		e.stopPropagation();
	}).on('click', '.remove', function(e) {
	    var value = jQuery(this).closest('.taggedInput').attr('data-value'),
	   		index = taggedInputs.indexOf(value);

	   		if (index > -1) 
			    taggedInputs.splice(index, 1);

	    	console.log('taggedInputs onclick', taggedInputs);
	    	jQuery(this).closest('.taggedInput').remove();
	});

	//remove multiselect values using 'backspace' key
	jQuery('.multiselect').on('keydown', function(e) {
	    if( e.which == 8 || e.which == 46 ) {
	    	var value = jQuery(this).prev('.taggedInput').attr('data-value'),
	    		index = taggedInputs.indexOf(value);

	    	if(jQuery(this).val().length === 0) {
	    		if (index > -1) 
				    taggedInputs.splice(index, 1);

				console.log('taggedInputs onkeypress', taggedInputs);
				jQuery(this).prev('.taggedInput').remove();
	    	}	
	    }
	});

});