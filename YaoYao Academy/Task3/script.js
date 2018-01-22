(function () {
    'use strict';

    // 按理说除了显示用的中文名，还应有其对应的value值（例如学校代码、行政区划编码等），用于实际逻辑处理
    // 此处简化直接用中文作为value
    const citySchools = {
        '北京': ['北京大学', '清华大学', '北京航空航天大学', '对外经贸大学'],
        '天津': ['天津大学', '南开大学'],
        '上海': ['上海交通大学', '复旦大学', '同济大学'],
        '南京': ['南京大学', '东南大学', '南京航空航天大学', '南京师范大学']
    };


    const form = document.forms[0];
    const citySelect = form.querySelector('#city-select');
    const schoolSelect = form.querySelector('#school-select');
    const variableInput = form.querySelector('#variable-input');
    const typeRadio = form.querySelector('#type-radio');

    typeRadio.addEventListener('change', handleTypeChange);

    const cities = Object.getOwnPropertyNames(citySchools);
    citySelect.appendChild(createOptions(cities));
    citySelect.addEventListener('change', handleCityChange);

    // 设置初始值
    setInputSection('school');
    setSchoolOptions('北京');

    /**
    * 将字符串数组映射为option DOM节点
    */
    function createOptions(valueArr) {
        const fragment = document.createDocumentFragment();
        valueArr.forEach(value => {
            const optionElem = document.createElement('option');
            optionElem.textContent = value;
            optionElem.value = value;
            fragment.appendChild(optionElem);
        });
        fragment.firstElementChild.selected = true;
        return fragment;
    }

    function setSchoolOptions(city) {
        const schoolArr = citySchools[city];
        schoolSelect.innerHTML = '';
        schoolSelect.appendChild(createOptions(schoolArr));
    }

    function handleCityChange() {
        setSchoolOptions(this.value);
    }

    function handleTypeChange(event) {
        setInputSection(event.target.value);
    }

    function setInputSection(showValue) {
        Array.from(variableInput.children).forEach(child => {
            child.classList.toggle('hidden', child.getAttribute('data-show') !== showValue);
        })
    }

})();
