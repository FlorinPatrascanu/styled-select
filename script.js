var selectUtils = {
    renderStyledSelect: function(targetElement, eventHandlerFn, selectId, cssClass) {
        var wrapper = '';
        var dropdownTriggerInputId = selectId + 'Checkbox';
        var firstOptionTextContent = document.querySelector(targetElement).querySelectorAll('option')[0].textContent;

        // hide select 
        if (!document.querySelector(targetElement).classList.contains('u-hidden')) {document.querySelector(targetElement).classList.add('u-hidden')}

        wrapper += '<div class="' + cssClass + '" id="' + selectId + '" data-target="' + targetElement.replace('#', '') + '">';

        wrapper += '<input type="checkbox" id="' + dropdownTriggerInputId + '" class="dropdown-trigger">';
        wrapper += '<div class="dropdown dw-mod js-filter">';
        wrapper += '<label class="dropdown__header dropdown__btn dw-mod" for="' + dropdownTriggerInputId + '">';
        wrapper += firstOptionTextContent;
        wrapper += '</label>';
        wrapper += '<div class="dropdown__content dw-mod">';
        // add search
        wrapper += '<div class="dropdown__item__filter"><input type="text" placeholder="Search"/></div>';

        document.querySelector(targetElement).querySelectorAll('option').forEach(function(element) {
            eventHandlerFn != null ? wrapper += '<div class="dropdown__item dw-mod" onclick="' + eventHandlerFn + '" data-value="' + element.value + '" tabindex=0>' :
                                     wrapper += '<div class="dropdown__item dw-mod" data-value="' + element.value + '" tabindex=0>';
            wrapper += element.textContent;
            wrapper += '</div>';
        });

        wrapper += '</div>'; // end dropdown content wrapper
        wrapper += ' <label class="dropdown-trigger-off u-bg-transparent" for="' + dropdownTriggerInputId + '"></label>';
        wrapper += '</div>'; // end dropdown wrapper
        wrapper += '</div>'; // end select wrapper
        return wrapper;
    },

    setStylesOnSelects: function(fieldId) {
        var elementId = '#' + fieldId;
        var selectId = 'Select' + fieldId;
        var parentNode = document.querySelector(elementId).parentNode;
        parentNode.insertAdjacentHTML('afterend', this.renderStyledSelect(elementId, 'selectUtils.updateSelect(event)', selectId, 'col-lg-6 col-md-6 col-sm-6 col-xs-12 u-no-padding styled-select'));
        parentNode.classList.add('u-hidden');
    },

    updateSelect: function(event, type) {
        var currentTarget = event.currentTarget;
        var selectedValue = currentTarget.attributes['data-value'].value;
        var targetedSelect = currentTarget.closest('.styled-select').attributes['data-target'].value;
        document.querySelector('select[id="' + targetedSelect + '"]').value = selectedValue;
        document.querySelector('select[id="' + targetedSelect + '"]').dispatchEvent(new Event('change'));
        // update label
        currentTarget.closest('.styled-select').querySelector('label.dropdown__header').innerHTML = event.currentTarget.textContent;
        currentTarget.closest('.styled-select').querySelector('.dropdown-trigger-off').dispatchEvent(new Event('click'));
        // recreate states 
        if (type == 'country') {
            /* countriesWithRegions should be an array with the following structure:
            [{
                countryName: 'Canada',
                countryCode: 'CA',
                countryRegions: [
                    {
                        regionName : 'Alberta',
                        regionCode : 'AB'
                    }
                ]
                ....
            }] */
            var targetCountry = countriesWithRegions.filter(function(obj) {return obj.countryCode == selectedValue;});
            document.querySelector('div.styled-select[data-target="' + targetedSelect.replace('Country', 'Region') + '"] .dropdown__content').querySelectorAll('.dropdown__item').forEach(function(el) {el.remove()});
            document.querySelector('div.styled-select[data-target="' + targetedSelect.replace('Country', 'Region') + '"] .dropdown__content').insertAdjacentHTML('beforeend', buildRegionSelect(targetCountry[0].countryRegions, false));
            // update label
            document.querySelector('div.styled-select[data-target="' + targetedSelect.replace('Country', 'Region') + '"] .dropdown__content').previousElementSibling.textContent = document.querySelector('div.styled-select[data-target="' + targetedSelect.replace('Country', 'Region') + '"] .dropdown__content').querySelectorAll('.dropdown__item')[0].textContent;
        }

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
    }
};
selectUtils.setStylesOnSelects('mySelect');
selectUtils.addSearchOptionsToSelect('#SelectmySelect');