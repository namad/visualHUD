/**
 * The set of methods that is used to build form controls
 * @type {Object}
 */
visualHUD.Libs.formControlsBuilder = {
	cache: {},

	createFieldset: function(attributes){
        var template = ([
                '<fieldset>',
                    '<legend><%= label %></legend>',
                '</fieldset>'
            ]).join('');

		var fieldset = $(_.template(template, attributes));

		return fieldset;
	},

	createTextbox: function(attributes){
		var template = ([
            '<div class="f-row">',
                '<span class="f-label"><%= label %></span>',
                '<span class="f-inputs">',
                    '<input type="text" size="<%= size %>" name="<%= name %>" value="<%= value %>" maxlength="<%= maxlength %>"  />',
			    '</span>',
            '</div>'
        ]).join('');
					
		var element = $(_.template(template, attributes));

		return element;
	},

	createRangeInput: function(attributes){
		var template = ([
            '<div class="f-row">',
                '<span class="f-label"><%= label %></span>',
                '<span class="f-inputs">',
                    '<div class="slider"><div class="progress"></div><input type="button" class="handle" /></div>',
                    '<input type="text" size="8" maxlength="3" value="<%= value %>" class="range range-input" name="<%= name %>"  />',
                '</span>',
            '</div>'
        ]).join('');

		_.extend(attributes, {
            precision: false,
            keyboard: false,
            progress: true,
            sliderSize: 160,
            handleSize: 12
        });

        var element = $(_.template(template, attributes));

		var input = element.find('input.range-input').rangeinput(attributes);

		return element;
	},

	createCheckbox: function(attributes){
        var template = ([
            '<div class="f-row">',
                '<span class="f-inputs">',
                    '<label class="check-label"><input type="checkbox" name="<%= name %>" checked="<%= value %>"><span class="label"><%= label %></span></label>',
                '</span>',
            '</div>'
        ]).join('');

        var element = $(_.template(template, attributes));

		return element;
	},

    createSelect: function(attributes){

        var template = ([
            '<div class="f-row">',
                '<span class="f-label"><%= label %></span>',
                '<span class="f-inputs">',
                    '<select type="text" name="<%= name %>" value="<%= value %>" style="width:<%= width %>"><%= options %></select>',
                '</span>',
            '</div>'
        ]).join('');

		
		var optionHTMLTemplate = '<option value="<%= value %>"><%= label %></option>';
		var optgroupHTMLTemplates = ['<optgroup label="<%= label %>">', '</optgroup>'];
		var selectHTML = [];

		var generateSelectOptions = function(opts){
            _.each(opts, function(value, key) {

                if($.isPlainObject(value)){
                    selectHTML.push(
                        _.template(optgroupHTMLTemplates[0], {
                            value: key
                        })
                    );
                    generateSelectOptions(option);
                    selectHTML.push(optgroupHTMLTemplates[1]);
                }
                else {
                    selectHTML.push(
                        _.template(optionHTMLTemplate, {
                            value: key,
                            label: value
                        })
                    );
                }
            });
			return selectHTML.join('')
		};



        attributes.options = generateSelectOptions(attributes.options);

        var element = $(_.template(template, attributes));

        if(attributes.value) {
            element.find('select').val(attributes.value);
        }
        else {
            element.find('select').attr('selectedIndex', 0);
        }

		return element;
	},

    createButton: function(attributes){
		var template = '<button name="<%= name %>" value="<%= value %>" class="<%= cssClass %>" title="<%= tooltip %>"><span class="{4}"><%= label %></span></button>';

        attributes.icon =  attributes.icon ? 'w-icon ' +  attributes.icon : '';

        var element = $(_.template(template, attributes));

        if(_.isFunction(attributes.fn)) {
            element.click(function(){
                return attributes.fn.apply(attributes.scope || window, attributes.args || arguments);
            });
        }
		
		return element;
	},

	createAlignControl: function(attributes){
        var template = ([
            '<div class="f-row">',
                '<span class="f-label"><%= label %></span>',
                '<span class="f-inputs">',
                '</span>',
            '</div>'
        ]).join('');

        var element = $(_.template(template, attributes));
        var icons = this.createAlignControlBasic();

        element.find('.f-inputs').append(icons);

		return element;
	},

    createAlignControlBasic: function() {
        var template = ([
            '<li class="align-top" data-action="top"><span class="item-name">Align top edges</span></li>',
            '<li class="align-vertical" data-action="vertical"><span class="item-name">Align vertical centers</span></li>',
            '<li class="align-bottom" data-action="bottom"><span class="item-name">Align bottom edges</span></li>',
            '<li class="align-left" data-action="left"><span class="item-name">Align left edges</span></li>',
            '<li class="align-horizontal" data-action="horizontal"><span class="item-name">Align horizontal centers</span></li>',
            '<li class="align-right" data-action="right"><span class="item-name">Align right edges</span></li>'
        ]).join('');

        var element = $('<ul class="library-items align-controls icons-24px clearfloat"/>');
        element.append(_.template(template, {}));

        return element;
    },

	createArrangeControl: function(attributes){
        var template = ([
            '<div class="f-row">',
            '<span class="f-label"><%= label %></span>',
            '<span class="f-inputs">',
            '</span>',
            '</div>'
        ]).join('');

        var element = $(_.template(template, attributes));
        var icons = this.createArrangeControlBasic();

        element.find('.f-inputs').append(icons);

        return element;
	},

    createArrangeControlBasic: function() {
        var template = ([
            '<li class="bring-front" data-action="arrangeFront"><span class="item-name">Bring to front <small>(CTRL + SHIFT + UP)</small></span></li>',
            '<li class="send-back" data-action="arrangeBack"><span class="item-name">Send to back <small>(CTRL + SHIFT + DOWN)</small></span></li>',
            '<li class="bring-forward" data-action="arrangeForward"><span class="item-name">Bring forward <small>(CTRL + UP)</small></span></li>',
            '<li class="send-backward" data-action="arrangeBackward"><span class="item-name">Send backward <small>(CTRL + DOWN)</small></span></li>'
        ]).join('');

        var element = $('<ul class="library-items arrange-controls icons-24px clearfloat"/>');
        element.append(_.template(template, {}));

        return element;
    },

	createColorPicker: function(attributes){
        var template = ([
            '<div class="f-row">',
                '<span class="f-label"><%= label %></span>',
                '<span class="f-inputs">',
                    '<input type="text" size="6" name="<%= name %>" value="<%= value %>" maxlength="6" class="color-input"  />',
                    '<div class="color-picker-box" style="background-color: #<%= value %>; "></div>',
                '</span>',
            '</div>'
        ]).join('');


        var element = $(_.template(template, attributes));
        return element;
	},

	createColorRange: function(attributes){
        var template = ([
            '<% _.each(ranges, function(range, idx) { %>',
                '<div class="f-row">',
                    '<span class="f-label"><%= range.name %></span>',
                    '<span class="f-inputs">',
                        '<span class="color-range-inputs mr-10">',
                            '<input type="text" size="3" name="colorRange_<%= idx %>_range_0" value="<%= range.range[0] %>" maxlength="3" class="color-range-input mr-5">',
                            '<input type="text" size="3" name="colorRange_<%= idx %>_range_1" value="<%= range.range[1] %>" maxlength="3" class="color-range-input mr-5">',
                        '</span>',
                        '<input type="text" size="6" name="colorRange_<%= idx %>_color" value="<%= range.color %>" maxlength="6" class="color-input" />',
                        '<div class="color-picker-box" style="background-color: #<%= range.color %>; "></div>',
                    '</span>',
                '</div>',
            '<% }); %>'
        ]).join('');

        var element = $('<div />').html(_.template(template, attributes));

		var rangeValueInputs = element.find('input.color-range-input');

        element.delegate('input[type=text]', 'change', function(event){
			var $input = $(this),
				index = rangeValueInputs.index(this),
				odd = (index + 1) % 2 == 0,
				value;

			var $nextInput = rangeValueInputs.eq(index + 1),
				$prevInput = rangeValueInputs.eq(index - 1);

			if(odd){
				value = parseInt(this.value);
				if($nextInput.length && !$nextInput.attr('readOnly')){
					$nextInput.val(value + 1);

                    $nextInput.trigger('change');
                    event.stopPropagation();
				}
			} else {
				value = parseInt(this.value);
				if($prevInput.length && !$prevInput.attr('readOnly')){
					$prevInput.val(value - 1);
                    $prevInput.trigger('change');
                    event.stopPropagation();
				}
			}
		});
					
		rangeValueInputs.first().attr('readonly', true);
		rangeValueInputs.last().attr('readonly', true);
		
		return element;
	}
};

