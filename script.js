var selectUtils = {
    config: {
        pushContent: false,
    },
    renderStyledSelect: function(targetElement, eventHandlerFn, selectId) {
        var wrapper = '';
        var dropdownTriggerInputId = selectId + 'Checkbox';
        var firstOptionTextContent = document.querySelector(targetElement).querySelectorAll('option')[0].textContent;
        // hide select
        if (!document.querySelector(targetElement).classList.contains('u-hidden')) {document.querySelector(targetElement).classList.add('u-hidden')}
        wrapper += '<div class="styled-select" id="' + selectId + '" data-target="' + targetElement.replace('#', '') + '">';
        wrapper += '<input type="checkbox" id="' + dropdownTriggerInputId + '" class="dropdown-trigger">';
        wrapper += '<div class="dropdown dw-mod js-filter">';
        wrapper += '<label class="dropdown__header dropdown__btn dw-mod" for="' + dropdownTriggerInputId + '">';
        wrapper += firstOptionTextContent;
        wrapper += '</label>';
        wrapper += '<div class="dropdown__content dw-mod">';
        // add search
        wrapper += '<div class="dropdown__item__filter"><input type="text" placeholder="Search"/></div>';
        wrapper += '<div class="dropdown__items__wrapper">';
        document.querySelector(targetElement).querySelectorAll('option').forEach(function(element) {
            eventHandlerFn != null ? wrapper += '<div class="dropdown__item dw-mod" onclick="' + eventHandlerFn + '" data-value="' + element.value + '" tabindex=0>' :
                                     wrapper += '<div class="dropdown__item dw-mod" data-value="' + element.value + '" tabindex=0>';
            wrapper += element.textContent;
            wrapper += '</div>';
        });
        wrapper += '</div>'; // end dropdown items wrapper
        wrapper += '</div>'; // end dropdown content wrapper
        wrapper += ' <label class="dropdown-trigger-off u-bg-transparent" for="' + dropdownTriggerInputId + '"></label>';
        wrapper += '</div>'; // end dropdown wrapper
        wrapper += '</div>'; // end select wrapper
        return wrapper;
    },

    makeStyledSelect: function(fieldId) {
        var elementId = '#' + fieldId;
        var selectId = 'Select' + fieldId;
        var parentNode = document.querySelector(elementId).parentNode;
        parentNode.insertAdjacentHTML('beforeend', this.renderStyledSelect(elementId, 'selectUtils.updateSelect(event)', selectId));
        this.addSearchOptionsToSelect('#' + selectId);
        this.handleOnFocusEnterKeyPress(document.querySelector('#' + selectId));
    },

    updateSelect: function(event) {
        var currentTarget = event.currentTarget;
        var selectedValue = currentTarget.attributes['data-value'].value;
        var targetedSelect = currentTarget.closest('.styled-select').attributes['data-target'].value;
        document.querySelector('select[id="' + targetedSelect + '"]').value = selectedValue;
        document.querySelector('select[id="' + targetedSelect + '"]').dispatchEvent(new Event('change'));
        // update label
        currentTarget.closest('.styled-select').querySelector('label.dropdown__header').innerHTML = event.currentTarget.textContent;
        currentTarget.closest('.styled-select').querySelector('.dropdown-trigger-off').dispatchEvent(new Event('click'));
        // close dropdown
        currentTarget.closest('.styled-select').querySelector('input.dropdown-trigger').checked = false;
    },

    addSearchOptionsToSelect: function(field) {
        document.querySelector(field).querySelector('.dropdown__item__filter input').addEventListener('keyup', function(event) {
            document.querySelector(field).querySelectorAll('.dropdown__item:not(.first__dropdown__option)').forEach(function(el) {
                el.textContent.toLowerCase().indexOf(event.currentTarget.value.toLowerCase()) >= 0 ? el.classList.remove('u-hidden') : el.classList.add('u-hidden');
            });
        });
        // clear filter after choosing an option
        document.querySelector(field).querySelectorAll('.dropdown__item:not(.first__dropdown__option)').forEach(function(el) {
            el.addEventListener('click', function(event) {
                document.querySelector(field).querySelector('.dropdown__item__filter input').value = '';
                document.querySelector(field).querySelectorAll('.dropdown__item:not(.first__dropdown__option)').forEach(function(element) {element.classList.remove('u-hidden')});
            });
        });
    },

    hideFirstOptionInStyledSelect: function(select) {
        // need to add first__dropdown__option so that when searching for options we don't show the first one 
        // also , this is usefull when we want to describe what needs to be done in the select : for instance 'Please select an option'
        document.querySelector(select).querySelectorAll('.dropdown__item')[0].classList.add('first__dropdown__option');
        document.querySelector(select).querySelectorAll('.dropdown__item')[0].classList.add('u-hidden');
    },

    handleOnFocusEnterKeyPress: function(select) {
        select.querySelectorAll('.dropdown__item').forEach(function(option){
            option.addEventListener('keypress' , function(event) {
                if(event.keyCode === 13) {option.click()}
            });
        });
    },

    setValueOnStyledSelect: function(select) {
        var target = document.querySelector('.styled-select[data-target="' + select.attributes.id.value + '"]');
        target.querySelector('.dropdown__header').innerHTML = target.querySelector('.dropdown__item[data-value="' + select.querySelector('option[selected="selected"]').value + '"]').innerHTML;
    },

    createAndAppendStyles: function() {
        var css = `        

        .styled-select .dropdown__items__wrapper {
            max-height: 290px;
            overflow: auto;
            margin-top: 50px;
            border-top: 1px solid #f1f2f2;
        }

        .styled-select .js-filter {
            position: relative;
        }

        .styled-select .js-filter .dropdown__item__filter {
            position: absolute;
            z-index: 999;
            display: none;
        }

        .styled-select .dropdown-trigger:checked ~ .js-filter .dropdown__item__filter {
            display: block !important;
            width: 100%;
            top: 0px;
        }

        .styled-select .dropdown-trigger {
            display: none;
        }

        .styled-select .dropdown__item.dw-mod {
            padding: 14px 22px !important;
            border-bottom: 1px solid #f1f2f2;
            font-size: 16px;
            margin: 0;
        }

        .styled-select .dropdown__item.dw-mod:hover {
            background-color: #e4e4e4;
        }

        .styled-select .dropdown__btn.dw-mod {
            border: 1px solid #f1f2f2;
            border-bottom: 2px solid #07263f;
            background-color: white !important;
            padding: 14px 22px !important;
            box-sizing: border-box;
            height: auto;
            line-height: normal;
        }

        .styled-select .dropdown__content {
            text-align: left;
            overflow: hidden;
            max-height: 0;
            max-height: 345px;
            position: ${selectUtils.config.pushContent ? 'relative' : 'absolute'};
            width: 100%;
            z-index: 100;
            background-color: #fff;
            border: 1px solid #d3d3d3;
            box-shadow: 0 3px 6px rgba(0,0,0,.175);
            display: none;
            top: ${selectUtils.config.pushContent ? '-5px' : '46px'};
        }

        .styled-select .dropdown-trigger-off {
            display: none;
            background-color: ${selectUtils.config.pushContent ? 'transparent' : 'rgba(0,0,0,.3)'};
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 90;
            left: 0;
            top: 0;
        }

        .styled-select .dropdown-trigger:checked+.dropdown .dropdown-trigger-off ,
        .styled-select .dropdown-trigger:checked+.dropdown .dropdown__content {
            display: block;
        }

        .u-hidden {
            display: none;
        }

        .styled-select .dropdown__header {
            width: 100%;
        }

        .styled-select .dropdown__header::after {
            font-family: "Font Awesome 5 Pro","Font Awesome 5 Free";
            font-weight: 900;
            content: '';
            margin-left: .5em;
            position: absolute;
            right: 1em;
            font-size: 18px;
        }

        .styled-select .dropdown-trigger:checked+.dropdown .dropdown__header::after {
            font-family: "Font Awesome 5 Pro","Font Awesome 5 Free";
            font-weight: 900;
            content: '';
            float: right;
            font-size: 18px;
        }

        .styled-select .dropdown__item__filter input {
            width: 100%;
            padding: 14px 22px !important;
            border: none;
        }`,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
        // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
};


window.addEventListener('load' , function(event){
    console.log('loaded! v2');
    selectUtils.createAndAppendStyles();
    document.querySelectorAll('.custom-select').forEach(function(item){
        selectUtils.makeStyledSelect(item.attributes.id.value);
        if(item.querySelector('option[selected="selected"]') !== null) {selectUtils.setValueOnStyledSelect(item);}
    });
});
